import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
    MoreHorizontal,
    Eye,
    ReceiptText,
    HandCoins,
    Ticket,
} from "lucide-react";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { router, usePage } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { useTrans } from "@/Hooks/useTrans";
import { useWindowDimensions } from "@/Hooks/useWindowDimensions";
import ColumnHeader from "@/Components/Admin/ColumnHeader";

export type Bookings = {
    booking_id: number;
    check_in: string;
    check_out: string;
    guest_number: number;
    created_at: string;
    booking_status: "en attente" | "confirmer" | "refusé" | "annuler";
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
};

export const historiqueColumns: ColumnDef<Bookings>[] = [
    {
        accessorKey: "Client",
        cell: ({ row }) => {
            const booking = row.original;
            return (
                <div>
                    <div className="font-bold text-base">
                        {booking.user.first_name} {booking.user.last_name}
                    </div>
                    {booking.user.email}
                </div>
            );
        },
        header: ({ column }) => <ColumnHeader title={"Client"} />,
    },
    {
        accessorKey: "Check in",
        cell: ({ row }) => {
            const booking = row.original;
            return <span>{booking.check_in}</span>;
        },
        header: ({ column }) => (
            // <DataTableColumnHeader
            //     column={column}
            //     title={useTrans("Check in")}
            // />
            <ColumnHeader title={"Check in"} />
        ),
    },
    {
        accessorKey: "Check out",
        cell: ({ row }) => {
            const booking = row.original;
            return <span>{booking.check_out}</span>;
        },
        header: ({ column }) => (
            // <DataTableColumnHeader
            //     column={column}
            //     title={useTrans("Check out")}
            // />
            // <div> {useTrans("Check out")} </div>
            <ColumnHeader title={"Check out"} />
        ),
    },
    {
        accessorKey: "Date de réservation",
        cell: ({ row }) => {
            const booking = row.original;
            return <span>{booking.created_at.split("T")[0]} </span>;
        },
        header: ({ column }) => (
            // <DataTableColumnHeader
            //     column={column}
            //     title={useTrans("Date de réservation")}
            // />
            <ColumnHeader title={"Date de réservation"} />
        ),
    },
    {
        accessorKey: "Status",
        cell: ({ row }) => {
            const booking = row.original;
            return booking.booking_status == "confirmer" ? (
                <Badge variant="success">{booking.booking_status}</Badge>
            ) : booking.booking_status == "en attente" ? (
                <Badge variant="warning">{booking.booking_status}</Badge>
            ) : (
                <Badge variant="danger">{booking.booking_status}</Badge>
            );
        },

        header: ({ column }) => <ColumnHeader title={"Status"} />,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const booking = row.original;
            const { width } = useWindowDimensions();
            const [open, setopen] = React.useState(false);
            const [isopen, setIsOpen] = React.useState(false);

            const booking_permission = usePage().props.auth.permissions.booking;

            const handleBookingStatus = (status) => {
                router.post(
                    route("bookings.change.status", booking.booking_id),
                    { booking_status: status },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            setopen(false);
                        },
                    }
                );
            };

            const handleBill = (id, payment) => {
                router.post(
                    route("factures.store", {
                        booking_id: id,
                        payment: payment,
                    })
                );
            };
            return (
                <DropdownMenu
                    open={isopen ? true : open}
                    onOpenChange={setopen}
                >
                    <DropdownMenuTrigger
                        className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                        })}
                    >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {booking.booking_status == "confirmer" ? (
                            <DropdownMenuItem>
                                {width >= 767 ? (
                                    <Dialog
                                        open={isopen}
                                        onOpenChange={setIsOpen}
                                    >
                                        <DialogTrigger className="cursor-pointer flex">
                                            <ReceiptText className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                            <span>{useTrans("Facture")}</span>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {useTrans(
                                                        "Mode de payment"
                                                    )}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {useTrans(
                                                        "Choisi le mode de payment pour cette facture"
                                                    )}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="gap-2 ">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleBill(
                                                            booking.booking_id,
                                                            "espece"
                                                        )
                                                    }
                                                    className="flex justify-center"
                                                    size="sm"
                                                >
                                                    <HandCoins className="mx-2 h-3.5 w-3.5" />
                                                    {useTrans("Espece")}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleBill(
                                                            booking.booking_id,
                                                            "chèque"
                                                        )
                                                    }
                                                    className="flex justify-center"
                                                    size="sm"
                                                >
                                                    <Ticket className="mx-2 h-3.5 w-3.5" />
                                                    {useTrans("Chèque")}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <Drawer
                                        open={isopen}
                                        onOpenChange={setIsOpen}
                                    >
                                        <DrawerTrigger className="cursor-pointer flex">
                                            <ReceiptText className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                                            <span>{useTrans("Facture")}</span>
                                        </DrawerTrigger>
                                        <DrawerContent>
                                            <DrawerHeader className="text-left">
                                                <DrawerTitle>
                                                    {useTrans(
                                                        "Mode de payment"
                                                    )}
                                                </DrawerTitle>
                                                <DrawerDescription>
                                                    {useTrans(
                                                        "Choisi le mode de payment pour cette facture"
                                                    )}
                                                </DrawerDescription>
                                            </DrawerHeader>
                                            <DrawerFooter className="pt-2">
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleBill(
                                                            booking.booking_id,
                                                            "espece"
                                                        )
                                                    }
                                                    className="flex justify-center"
                                                    size="sm"
                                                >
                                                    <HandCoins className="mx-2 h-3.5 w-3.5" />
                                                    {useTrans("Espece")}
                                                </Button>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() =>
                                                        handleBill(
                                                            booking.booking_id,
                                                            "check"
                                                        )
                                                    }
                                                    className="flex justify-center"
                                                    size="sm"
                                                >
                                                    <Ticket className="mx-2 h-3.5 w-3.5" />
                                                    {useTrans("Chèque")}
                                                </Button>
                                            </DrawerFooter>
                                        </DrawerContent>
                                    </Drawer>
                                )}
                            </DropdownMenuItem>
                        ) : booking.booking_status == "en attente" &&
                          booking_permission.update &&
                          route().current("bookings.index") ? (
                            <DropdownMenuItem className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        handleBookingStatus("confirmer")
                                    }
                                >
                                    Confirmer
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() =>
                                        handleBookingStatus("refusé")
                                    }
                                >
                                    Refusé
                                </Button>
                            </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem
                            onClick={() =>
                                router.get(
                                    route("bookings.show", booking.booking_id)
                                )
                            }
                            className="cursor-pointer"
                        >
                            <Eye className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            <span>{useTrans("Voir")} </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
