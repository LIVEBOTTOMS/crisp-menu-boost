import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Sparkles, LayoutTemplate } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TemplateMarketplace } from '@/components/TemplateMarketplace';

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Menu name must be at least 2 characters.",
    }),
    type: z.string().min(1, {
        message: "Please select a venue type.",
    }),
});

export default function CreateMenuPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const { user } = useAuth();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "restaurant",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (!user) {
                toast({
                    title: "Authentication required",
                    description: "Please log in to create a menu",
                    variant: "destructive",
                });
                return;
            }

            setIsLoading(true);

            const { data: venue, error: venueError } = await supabase
                .from('venues')
                .insert({
                    name: values.name,
                    slug: values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substring(2, 7),
                    type: values.type,
                    owner_id: user.id
                })
                .select()
                .single();

            if (venueError) throw venueError;

            // Create default menu section
            const { error: sectionError } = await supabase
                .from('menu_sections')
                .insert({
                    venue_id: venue.id,
                    name: 'Main Menu',
                    order: 0
                });

            if (sectionError) throw sectionError;

            toast({
                title: "Success",
                description: "Menu created successfully",
            });

            navigate('/menus');
        } catch (error: any) {
            console.error('Error creating menu:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to create menu",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Create New Menu
                </h1>
                <p className="text-gray-400 mb-8">Choose how you want to start building your menu</p>

                <Tabs defaultValue="scratch" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 mb-8 h-auto p-1">
                        <TabsTrigger value="scratch" className="data-[state=active]:bg-cyan-500 data-[state=active]:text-white py-3">
                            <Plus className="w-4 h-4 mr-2" /> Start from Scratch
                        </TabsTrigger>
                        <TabsTrigger value="template" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-3">
                            <LayoutTemplate className="w-4 h-4 mr-2" /> Use Template
                        </TabsTrigger>
                        <TabsTrigger value="ai" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white py-3">
                            <Sparkles className="w-4 h-4 mr-2" /> AI Import (PDF/Img)
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="scratch">
                        <Card className="max-w-md mx-auto bg-white/5 border-white/10 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="text-white">Basic Details</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Start with a blank canvas and build your menu your way.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Venue Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. The Burger Joint" {...field} className="bg-white/5 border-white/10 text-white" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-white">Venue Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                                                                <SelectValue placeholder="Select venue type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="restaurant">Restaurant</SelectItem>
                                                            <SelectItem value="cafe">Cafe</SelectItem>
                                                            <SelectItem value="bar">Bar</SelectItem>
                                                            <SelectItem value="bistro">Bistro</SelectItem>
                                                            <SelectItem value="food_truck">Food Truck</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                "Create Menu"
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="template">
                        <TemplateMarketplace />
                    </TabsContent>

                    <TabsContent value="ai">
                        <Card className="max-w-2xl mx-auto bg-white/5 border-white/10 text-center py-12">
                            <CardContent>
                                <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-10 h-10 text-pink-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">AI Menu Importer Coming Soon!</h3>
                                <p className="text-gray-400 max-w-md mx-auto mb-8">
                                    Simply drag & drop your PDF menu or take a photo, and our AI will extract all items, prices, and categories automatically.
                                </p>
                                <Button disabled variant="secondary" className="cursor-not-allowed opacity-50">
                                    Join Waitlist
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
