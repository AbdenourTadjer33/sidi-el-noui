<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {

        $services = Service::with('assets')->get();

        return Inertia::render('Admin/Services/Services', ['services' => $services]);
    }

    public function show(Service $service)
    {
        return Inertia::render('Admin/Services/Service', ['service' => $service]);
    }

    public function create()
    {
        return Inertia::render('Admin/Services/CreateService');
    }

    public function store(Request $request)
    {
        request()->validate(
            [
                'service_name' => 'required|string',
                'service_descreption' => 'required|string|max:255',
                'assets' => 'required|array',
                'assets.*' => 'file|mimes:jpg,png,jpeg|max:2048',
            ]
        );

        // dd($request->all());
        DB::beginTransaction();
        try {
            $service = Service::create([
                'service_name' => $request->service_name,
                'service_descreption' => $request->service_descreption,
                'availability' => true,
            ]);

            foreach ($request->file('assets') as $key => $value) {
                $filename = $value->store('service', 'public');

                $service->assets()->create([
                    'name' => "Service-{$request->service_name}-img-$key",
                    'url' => $filename,
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return redirect(route('services.index'))->with('message', ['status' => 'success', 'message' => 'Service crée avec succès']);
    }

    public function edit(Service $service)
    {
        return Inertia::render('Admin/Services/EditService', ['service' => $service]);
    }

    public function update(Request $request)
    {
        request()->validate(
            [
                'service_name' => 'required|string',
                'service_descreption' => 'required|string|max:255',
                'assets' => 'required|array',
                'assets.*' => 'file|mimes:jpg,png,jpeg|max:2048',
            ]
        );
        DB::beginTransaction();
        try {
            $service = Service::where('service_id', $request->service)->first();

            $service->update([
                'service_name' => $request->service_name,
                'service_descreption' => $request->service_descreption,
            ]);
            if ($request->hasFile('assets')) {
                foreach ($request->file('assets') as $key => $file) {
                    $filename = $file->store('services', 'public');

                    $service->assets()->create([
                        'name' => "service-{$request->service_name}-img-{$key}",
                        'url' => $filename,
                    ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
        return redirect()->back()->with('message', ['status' => 'success', 'message' => 'Service modifier avec succès']);
    }

    public function toggleAvailability(Request $request)
    {
        $service = Service::where('service_id', $request->service_id)->first();
        $service->update([
            'availability' => !$service->availability
        ]);
        redirect()->back()->with('message', ['status' => 'success', 'message' => $service->availability ? "Le service '$service->service_name' est disponible" : "Le service '$service->service_name' est indisponible"]);
    }

    public function destroy(string $id)
    {
        Service::where('service_id', $id)->delete();
        return redirect()->back()->with('message', ['status' => 'success', 'message'
        => 'Service supprimé avec succès']);
    }
}
