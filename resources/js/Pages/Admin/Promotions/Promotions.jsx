import React, { useEffect } from "react";
import { Head, Link, usePage } from "@inertiajs/react";

import PlaceholderContent from "@/Components/Admin/Layout/PlaceholderContent";
import AdminPanelLayout from "@/Layouts/AdminPanelLayout";
import PageHeading from "@/Components/ui/PageHeading";

import { useToast } from "@/Components/ui/use-toast";
import { Button } from "@/Components/ui/button";
import { useTrans } from "@/Hooks/useTrans";
import PromotionCard from "@/Components/Admin/Promotions/PromotionCard";
import EmptyPage from "@/Components/Admin/Shared/EmptyPage";
import { TicketMinus } from "lucide-react";

export default function Promotions({ promotions, promotion_permission }) {
    const { toast } = useToast();
    const flash = usePage().props.flash;

    useEffect(() => {
        if (flash.message) {
            toast({ description: flash.message?.message });
        }
    }, [flash.message, toast]);

    return (
        <AdminPanelLayout>
            <Head title="Promotions" />
            <PageHeading title={useTrans("Promotions")} />
            <div className="flex justify-end">
                {promotion_permission.create && (
                    <Button variant="secondary">
                        <Link href={route("promotions.create")}>
                            {useTrans("Créer un promotion")}
                        </Link>
                    </Button>
                )}
            </div>
            <PlaceholderContent>
                {promotions.length ? (
                    <>
                        <div className="font-bold p-4">
                            {useTrans("List des promotions")} :
                        </div>
                        {promotions.map((promo) => (
                            <PromotionCard
                                promotion={promo}
                                key={promo.promotion_id}
                            />
                        ))}
                    </>
                ) : (
                    <EmptyPage
                        text="Aucun promotion pour l'instant, essayez de créer une nouvelle"
                        icon={TicketMinus}
                    />
                )}
            </PlaceholderContent>
        </AdminPanelLayout>
    );
}
