"use client";

import { Mail, Phone, Clock, MessageSquare, Reply } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Enquiry {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    message: string;
    status: string;
    createdAt: Date | string;
}

interface EnquiriesListProps {
    enquiries: Enquiry[];
}

export default function EnquiriesList({ enquiries: initialEnquiries }: EnquiriesListProps) {
    const [enquiries, setEnquiries] = useState(initialEnquiries);

    const handleStatusChange = async (id: string, newStatus: string) => {
        setEnquiries(enquiries.map(eq => eq.id === id ? { ...eq, status: newStatus } : eq));
        // Real implementation would also call API:
        // await fetch(`/api/enquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });
    };

    if (enquiries.length === 0) {
        return (
            <Card className="p-12 text-center border-dashed">
                <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Enquiries</h3>
                    <p className="text-slate-500 font-medium">Your inbox is empty. New messages will appear here.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {enquiries.map((enquiry) => (
                <Card key={enquiry.id} className="hover:shadow-sm transition-all duration-200">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex-1 flex flex-col md:flex-row md:items-start gap-4 md:gap-6 min-w-0">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 shadow-sm mt-1">
                                        <span className="text-lg font-bold text-slate-700">
                                            {enquiry.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-lg font-bold text-slate-900 truncate">{enquiry.name}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-slate-500 font-medium">
                                                <span className="flex items-center gap-1.5 break-all">
                                                    <Mail className="w-4 h-4 shrink-0" /> {enquiry.email}
                                                </span>
                                                {enquiry.phone && (
                                                    <span className="flex items-center gap-1.5 shrink-0">
                                                        <Phone className="w-4 h-4 shrink-0" /> {enquiry.phone}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                enquiry.status === 'New' ? 'default' :
                                                    enquiry.status === 'Responded' ? 'secondary' :
                                                        'outline'
                                            }
                                            className={cn(
                                                "self-start sm:self-auto",
                                                enquiry.status === 'New' && "bg-blue-100 text-blue-800 hover:bg-blue-100 border-none",
                                                enquiry.status === 'Responded' && "bg-amber-100 text-amber-800 hover:bg-amber-100 border-none"
                                            )}
                                        >
                                            {enquiry.status}
                                        </Badge>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-slate-700 text-sm leading-relaxed overflow-hidden">
                                        <p className="break-words">&quot;{enquiry.message}&quot;</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[180px] md:pl-6 md:border-l border-slate-200">
                                <Select
                                    value={enquiry.status.toLowerCase()}
                                    onValueChange={(value) => handleStatusChange(enquiry.id, value === 'pending' ? 'New' : value === 'responded' ? 'Responded' : 'Closed')}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="responded">Responded</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button className="w-full">
                                    <Reply className="w-4 h-4 mr-2" />
                                    Reply
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
