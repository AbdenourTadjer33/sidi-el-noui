import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AdminPanelLayout from "@/Layouts/AdminPanelLayout";
import PlaceholderContent from "@/Components/Admin/Layout/PlaceholderContent";

import PageHeading from "@/Components/ui/PageHeading";

export default function Dashboard() {
    const props = usePage().props;
    console.log(props);
    return (
        <AdminPanelLayout>
            <Head title="Dashboard" />
            <PageHeading title={"Tablaux De Bord"} />
            <PlaceholderContent>Dashboard</PlaceholderContent>
        </AdminPanelLayout>
    );
}
