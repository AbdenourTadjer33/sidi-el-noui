import React, { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import PlaceholderContent from "@/Components/Admin/Layout/PlaceholderContent";
import AdminPanelLayout from "@/Layouts/AdminPanelLayout";
import PageHeading from "@/Components/ui/PageHeading";
import { useToast } from "@/Components/ui/use-toast";
import ConsommationDialog from "@/Components/Admin/Services/ConsommationDialog";
import ConsommationCard from "@/Components/Admin/Services/ConsommationCard";
import { useTrans } from "@/Hooks/useTrans";
import { HandPlatter } from "lucide-react";
import EmptyPage from "@/Components/Admin/Shared/EmptyPage";

export default function Consumptions({ consumptions, services }) {
    const { toast } = useToast();
    const flash = usePage().props.flash;

    useEffect(() => {
        if (flash.message) {
            toast({ description: flash.message?.message });
        }
    }, [flash.message, toast]);

    return (
        <AdminPanelLayout>
            <Head title="Consumptions" />
            <PageHeading title={useTrans("Consommations")} />
            <div className="flex justify-end">
                <ConsommationDialog services={services} mode="create" />
            </div>
            <PlaceholderContent>
                {consumptions.lenght ? (
                    <>
                        <div className="font-bold p-4">
                            {useTrans("List des consommations")} :
                        </div>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {consumptions.map((consumption) => (
                                <div key={consumption.consumption_id}>
                                    <ConsommationCard
                                        consumption={consumption}
                                        services={services}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <EmptyPage
                        text="Aucun consommations pour l'instant, essayez de créer un nouveau"
                        icon={HandPlatter}
                    />
                )}
            </PlaceholderContent>
        </AdminPanelLayout>
    );
}
