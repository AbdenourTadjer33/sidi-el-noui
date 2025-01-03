import React, { useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import PlaceholderContent from "@/Components/Admin/Layout/PlaceholderContent";
import AdminPanelLayout from "@/Layouts/AdminPanelLayout";
import { DataTable } from "@/Components/Admin/DataTable";
import { featuresColumns } from "@/Components/Admin/Rooms/FeaturesColumns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import PageHeading from "@/Components/ui/PageHeading";
import { useToast } from "@/Components/ui/use-toast";
import FeatureCreateDialog from "@/Components/Admin/Rooms/FeatureCreateDialog";
import { useTrans } from "@/Hooks/useTrans";
import CategoryDialog from "@/Components/Admin/Rooms/CategoryDialog";
import CategoryCard from "@/Components/Admin/Rooms/CategoryCard";
import { Hotel } from "lucide-react";
import EmptyPage from "@/Components/Admin/Shared/EmptyPage";

export default function Features({ features, categorys }) {
    const { toast } = useToast();
    const flash = usePage().props.flash;

    useEffect(() => {
        if (flash.message) {
            toast({ description: flash.message?.message });
        }
    }, [flash.message, toast]);

    return (
        <AdminPanelLayout>
            <Head title="Rooms" />
            <PageHeading title={useTrans("Caractéristiques")} />
            <Tabs defaultValue="features" className="mt-2">
                <TabsList className="w-full flex justify-start rtl:justify-end bg-transparent border-b-2 rounded-none	">
                    <div className="flex justify-start">
                        <TabsTrigger
                            value="features"
                            className="mr-2 font-bold text-xl rounded-none bg-transparent data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary data-[state=active]:text-primary shadow-none "
                        >
                            {useTrans("Caractéristiques")}
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() =>
                                !categorys &&
                                router.reload({ only: ["categorys"] })
                            }
                            value="category"
                            className="mr-2 font-bold text-xl rounded-none bg-transparent shadow-none data-[state=active]:bg-transparent data-[state=active]:border-b-2 border-primary data-[state=active]:text-primary "
                        >
                            {useTrans("Catégories")}
                        </TabsTrigger>
                    </div>
                </TabsList>
                <TabsContent value="features">
                    <div className="flex justify-end rtl:justify-start ">
                        <FeatureCreateDialog categorys={categorys} />
                    </div>
                    <PlaceholderContent>
                        {features.length ? (
                            <DataTable
                                columns={featuresColumns}
                                data={features}
                                selection={true}
                            />
                        ) : (
                            <EmptyPage
                                icon={Hotel}
                                text="Aucun caractéristiques pour l'instant, essayez de créer une nouvelle"
                            />
                        )}
                    </PlaceholderContent>
                </TabsContent>
                <TabsContent value="category">
                    <div className="flex justify-end rtl:justify-start">
                        <CategoryDialog mode="create" />
                    </div>
                    <PlaceholderContent>
                        {categorys.length ? (
                            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {categorys &&
                                    categorys.map((category) => (
                                        <CategoryCard category={category} />
                                    ))}
                            </div>
                        ) : (
                            <EmptyPage
                                icon={Hotel}
                                text="Aucun categories pour l'instant, essayez de créer une nouvelle"
                            />
                        )}
                    </PlaceholderContent>
                </TabsContent>
            </Tabs>
        </AdminPanelLayout>
    );
}
