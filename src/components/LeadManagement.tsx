import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Phone, Mail, Calendar, User, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";

interface Lead {
    id: string;
    created_at: string;
    phone: string | null;
    email: string | null;
    source: string | null;
}

interface LeadManagementProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LeadManagement = ({ isOpen, onClose }: LeadManagementProps) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await (supabase as any)
                .from('customer_leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLeads();
        }
    }, [isOpen]);

    const handleDownloadCSV = () => {
        const headers = ["Date", "Phone", "Email", "Source"];
        const csvContent = [
            headers.join(","),
            ...leads.map(lead => [
                new Date(lead.created_at).toLocaleString(),
                lead.phone || "-",
                lead.email || "-",
                lead.source || "-"
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `customer_leads_${format(new Date(), 'yyyy-MM-dd')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl bg-slate-900 border-slate-700 max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle className="text-2xl font-orbitron text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <User className="h-6 w-6 text-neon-cyan" />
                            Customer Leads
                            <span className="text-sm font-sans text-slate-400 font-normal ml-2">
                                ({leads.length} total)
                            </span>
                        </div>
                        <Button
                            onClick={handleDownloadCSV}
                            variant="outline"
                            className="bg-green-600/20 text-green-400 border-green-600/50 hover:bg-green-600/30"
                            disabled={leads.length === 0}
                        >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        View and manage potential customers who scanned the QR code.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto mt-4 border rounded-md border-slate-700">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                            <User className="h-10 w-10 mb-2 opacity-20" />
                            <p>No leads captured yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-800/50 sticky top-0">
                                <TableRow className="border-slate-700 hover:bg-transparent">
                                    <TableHead className="text-slate-300 w-[180px]">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" /> Date
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" /> Phone
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" /> Email
                                        </div>
                                    </TableHead>
                                    <TableHead className="text-slate-300">Source</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow key={lead.id} className="border-slate-800 hover:bg-slate-800/50">
                                        <TableCell className="text-slate-300 font-mono text-xs">
                                            {format(new Date(lead.created_at), "PP p")}
                                        </TableCell>
                                        <TableCell className="text-white font-medium">
                                            {lead.phone || <span className="text-slate-600 italic">--</span>}
                                        </TableCell>
                                        <TableCell className="text-white">
                                            {lead.email || <span className="text-slate-600 italic">--</span>}
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-xs uppercase tracking-wider">
                                            {lead.source}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
