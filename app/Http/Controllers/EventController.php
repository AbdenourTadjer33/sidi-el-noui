<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EventController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->user()->cannot('viewAny', Event::class) && ($request->user()->cannot('create', Event::class) || $request->user()->cannot('delete', Event::class) || $request->user()->cannot('update', Event::class))) {
            return Inertia::render('Error/Error_403');
        }

        $events = Event::with('assets')->get();
        return Inertia::render('Admin/Events/Events', ['events' => $events]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        if ($request->user()->cannot('create', Event::class)) {
            return Inertia::render('Error/Error_403');
        }
        return Inertia::render('Admin/Events/CreateEvent');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->user()->cannot('create', Event::class)) {
            return Inertia::render('Error/Error_403');
        }
        request()->validate(
            [
                'event_name' => 'required|string',
                'event_descreption' => 'required|string|max:255',
                'event_start_date' => 'required|date',
                'event_end_date' => 'required|date',
                'event_price' => 'required|numeric',
                'assets' => 'required|array',
                'assets.*' => 'file|mimes:jpg,png,jpeg|max:2048',
            ]
        );


        DB::beginTransaction();
        try {
            $service = Event::create([
                'user_id' => Auth::user()->id,
                'event_name' => $request->event_name,
                'event_descreption' => $request->event_descreption,
                'event_start_date' => $request->event_start_date,
                'event_end_date' => $request->event_end_date,
                'event_price' => $request->event_price,
            ]);

            foreach ($request->file('assets') as $key => $value) {
                $filename = $value->store('event', 'public');
                $service->assets()->create([
                    'name' => "event-{$request->event_name}-img-$key",
                    'url' => $filename,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return redirect(route('events.index'))->with('message', ['status' => 'success', 'message' => 'Evènement crée avec succès']);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id, Request $request)
    {
        if ($request->user()->cannot('update', Event::class)) {
            return Inertia::render('Error/Error_403');
        }
        $event = Event::with('assets')->where('event_id', $id)->first();
        return Inertia::render('Admin/Events/EditEvent', ['event' => $event]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        if ($request->user()->cannot('update', Event::class)) {
            return Inertia::render('Error/Error_403');
        }
        request()->validate(
            [
                'event_name' => 'required|string',
                'event_descreption' => 'required|string|max:255',
                'event_start_date' => 'required|date',
                'event_end_date' => 'required|date',
                'event_price' => 'required|numeric',
                'assets' => 'array',
                'assets.*' => 'file|mimes:jpg,png,jpeg|max:2048',
            ]
        );


        DB::beginTransaction();
        try {
            $event = Event::where('event_id', $request->event)->first();

            $event->update([
                'event_name' => $request->event_name,
                'event_descreption' => $request->event_descreption,
                'event_start_date' => $request->event_start_date,
                'event_end_date' => $request->event_end_date,
                'event_price' => $request->event_price,
            ]);
            if ($request->hasFile('assets')) {
                foreach ($request->file('assets') as $key => $value) {
                    $filename = $value->store('event', 'public');
                    $event->assets()->create([
                        'name' => "event-{$request->event_name}-img-$key",
                        'url' => $filename,
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return redirect(route('events.index'))->with('message', ['status' => 'success', 'message' => 'Evènement modifier avec succès']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, Request $request)
    {
        if ($request->user()->cannot('delete', Event::class)) {
            return Inertia::render('Error/Error_403');
        }
        Event::where('event_id', $id)->delete();
        return redirect()->back()->with('message', ['status' => 'success', 'message'
        => 'Evènement supprimé avec succès']);
    }
}
