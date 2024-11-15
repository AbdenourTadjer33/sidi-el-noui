<?php

namespace App\Http\Controllers;

use App\Enums\room_status;
use App\Models\Assets;
use App\Models\Category;
use App\Models\Room;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->cannot('viewAny', Room::class) && ($request->user()->cannot('update', Room::class) || $request->user()->cannot('create', Room::class))) {
            return abort(403);
        }
        $itemsPerPage = $request->input('pages', 10);
        $rooms = Room::with('type')->orderBy('room_number')->paginate($itemsPerPage);
        return Inertia::render('Admin/Rooms/Rooms', ['rooms' => $rooms, 'room_permission' =>  getModelPermission($request, Room::class)]);
    }

    public function show(Request $request)
    {
        if ($request->user()->cannot('viewAny', Room::class) && ($request->user()->cannot('update', Room::class))) {
            return abort(403);
        }

        $room = Room::with(['features', 'assets', 'type'])->where('room_number', $request->room)->first();
        $categorys = Category::all();

        return Inertia::render('Admin/Rooms/Room', ['room' => $room, 'categorys' => $categorys]);
    }

    public function create(Request $request)
    {
        if ($request->user()->cannot('create', Room::class)) {
            return abort(403);
        }

        $types = Type::all();
        $categorys = Category::with('feature')->get();

        return Inertia::render('Admin/Rooms/RoomCreate', ['types' => $types, 'categorys' => $categorys]);
    }

    public function store(Request $request)
    {
        if ($request->user()->cannot('create', Room::class)) {
            return abort(403);
        }
        request()->validate(
            [
                'room_number' => 'required|unique:' . Room::class,
                'type_id' => 'required',
                'room_descreption' => 'required|string',
                'room_price' => 'required|numeric',
                'beeds_number' => 'required|numeric',
                'features' => 'array',
                'assets' => 'required|array',
                'assets.*' => 'file|mimes:jpg,png,jpeg|max:2048',
            ]
        );

        DB::beginTransaction();
        try {
            $room = Room::create([
                'room_number' => $request->room_number,
                'type_id' => $request->type_id,
                'room_descreption' => $request->room_descreption,
                'room_price' => $request->room_price,
                'beeds_number' => $request->beeds_number,
                'room_status' => room_status::Free->value,
            ]);
            if ($request->features) {
                foreach ($request->features as $feature) {
                    $room->features()->attach($feature['id'], ['valeur' => $feature['value']]);
                }
            }

            foreach ($request->file('assets') as $key => $value) {
                $filename = $value->store('rooms', 'public');

                $room->assets()->create([
                    'name' => "Room-{$request->room_number}-img-$key",
                    'url' => $filename,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        Cache::forget('home-rooms');
        return redirect(route('rooms.index'));
    }

    public function edit(Request $request,)
    {
        if ($request->user()->cannot('update', Room::class)) {
            return abort(403);
        }

        $types = Type::all();
        $categorys = Category::with('feature')->get();
        $room = Room::with(['features', 'assets', 'type'])->where('room_number', $request->room)->get();
        return Inertia::render('Admin/Rooms/RoomEdit', ['room' => $room, 'types' => $types, 'categorys' => $categorys]);
    }

    public function update(Request $request)
    {
        if ($request->user()->cannot('update', Room::class)) {
            return abort(403);
        }

        request()->validate(
            [
                'room_number' => 'required',
                'type_id' => 'required',
                'room_descreption' => 'required|string',
                'room_price' => 'required|numeric',
                'beeds_number' => 'required|numeric',
                'features' => 'array',
                'features.*.feature_id' => 'required|integer',
                'features.*.features_name' => 'required|string',
                'features.*.need_value' => 'required|boolean',
                'features.*.value' => 'nullable|string',
                'assets' => 'array|required_if:required_assets,true',
                'required_assets' => 'boolean',
                'remouved_assets' => 'array',
                'assets.*' => 'file|mimes:jpg,png,jpeg,gif,svg|max:2048',
            ]
        );
        DB::beginTransaction();
        try {
            $room = Room::where('room_number', $request->room_number)->first();

            $room->update([
                'type_id' => $request->type_id,
                'room_descreption' => $request->room_descreption,
                'room_price' => $request->room_price,
                'beeds_number' => $request->beeds_number,

            ]);
            if ($request->has('features')) {
                $room->features()->detach();
                foreach ($request->features as $feature) {
                    $room->features()->attach($feature['feature_id'], ['valeur' => $feature['value']]);
                }
            }
            if ($request->hasFile('assets')) {

                foreach ($request->file('assets') as $key => $file) {
                    $filename = $file->store('rooms', 'public');

                    $room->assets()->create([
                        'name' => "Room-{$request->room_number}-img-{$key}",
                        'url' => $filename,
                    ]);
                }
            }
            if ($request->has('remouved_assets')) {
                foreach ($request->remouved_assets as $asset_id) {
                    $asset = Assets::find($asset_id);
                    Storage::disk('public')->delete($asset->getOriginalUrlAttribute());
                    $asset->delete();
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return redirect(route("rooms.index"));
    }

    public function toggleStatus(Request $request)
    {
        $room = Room::where('room_number', $request->room_number)->first();
        $room->update([
            'room_status' => $request->room_status
        ]);
        return redirect()->back();
    }
}
