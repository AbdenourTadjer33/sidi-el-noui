import React from "react";
import { Button } from "@/Components/ui/button";
import { useTrans } from "@/Hooks/useTrans";
import { Settings2 } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { Input } from "@/Components/ui/input";
import LabelDescreption from "@/Components/LabelDescreption";
import { Separator } from "@/Components/ui/separator";
import { useForm } from "@inertiajs/react";

export default function FactureSettings({ bill_settings }) {
    const [open, setOpen] = React.useState(false);
    const { data, setData, errors, post } = useForm({
        tva: bill_settings?.tva,
        timbre: bill_settings?.timbre,
        tourist_tax: bill_settings?.tourist_tax,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("factures.bill.settings"), {
            onSuccess: () => setOpen(false),
        });
    };
    return (
        <Sheet open={open || !bill_settings} onOpenChange={setOpen}>
            <SheetTrigger>
                <Settings2 />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{useTrans("Parametre de facture")}</SheetTitle>
                    <SheetDescription>
                        {useTrans("Modifier les constant de facturation içi")}
                    </SheetDescription>
                    <form onSubmit={submit}>
                        <div className="w-full bg-muted p-4 shadow my-4">
                            <InputLabel htmlFor="tva" value="TVA" />
                            <LabelDescreption>
                                {useTrans("La valeur de TVA en %")}
                            </LabelDescreption>
                            <Input
                                className="mt-2 w-full bg-card"
                                id="tva"
                                value={data.tva}
                                onChange={(e) => setData("tva", e.target.value)}
                            />
                            <InputError message={errors.tva} className="mt-2" />
                        </div>
                        <Separator />
                        <div className="w-full bg-muted p-4 shadow my-4">
                            <InputLabel
                                htmlFor="tourist_tax"
                                value={useTrans("Taxe de séjour")}
                            />
                            <LabelDescreption>
                                {useTrans(
                                    "la valeur de taxe de séjour en DA/personne"
                                )}
                            </LabelDescreption>
                            <Input
                                className="mt-2 w-full bg-card"
                                id="tourist_tax"
                                value={data.tourist_tax}
                                onChange={(e) =>
                                    setData("tourist_tax", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.tourist_tax}
                                className="mt-2"
                            />
                        </div>
                        <Separator />
                        <div className="w-full bg-muted p-4 shadow my-4">
                            <InputLabel
                                htmlFor="timbre"
                                value={useTrans("Droit de timbre")}
                            />
                            <LabelDescreption>
                                {useTrans("La valeur de tibmre en %")}
                            </LabelDescreption>
                            <Input
                                className="mt-2 w-full bg-card"
                                id="timbre"
                                value={data.timbre}
                                onChange={(e) =>
                                    setData("timbre", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.timbre}
                                className="mt-2"
                            />
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full"
                        >
                            {useTrans("Enregistrer")}
                        </Button>
                    </form>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}