import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Eye, Search, ChefHat, Coffee, wine, Beer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Template {
    id: string;
    name: string;
    template_category: string;
    template_tags: string[];
    preview_image_url: string;
    theme_settings: any;
}

const CATEGORIES = ['All', 'Fine Dining', 'Bar & Nightclub', 'Cafe', 'Fast Food', 'Casual'];

export function TemplateMarketplace() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCloning, setIsCloning] = useState<string | null>(null);
    const [newMenuName, setNewMenuName] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const { data, error } = await supabase
                .from('venues')
                .select('*')
                .eq('is_template', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTemplates(data || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
            toast({ title: 'Error', description: 'Failed to load templates', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseTemplate = async (template: Template) => {
        if (!newMenuName.trim()) {
            toast({ title: 'Name Required', description: 'Please enter a name for your new menu', variant: 'destructive' });
            return;
        }

        setIsCloning(template.id);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase.rpc('clone_venue_from_template', {
                template_id: template.id,
                new_owner_id: user.id,
                new_name: newMenuName
            });

            if (error) throw error;

            toast({
                title: 'Success!',
                description: 'Menu created from template successfully.',
            });

            // Navigate to the dashboard (or the new menu if we had the slug)
            // Since the RPC returns the ID, we can ideally redirect to edit page if we fetch the slug
            navigate('/menus');

        } catch (error: any) {
            console.error('Error cloning template:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to create menu from template',
                variant: 'destructive'
            });
        } finally {
            setIsCloning(null);
        }
    };

    const filteredTemplates = templates.filter(t => {
        const matchesCategory = selectedCategory === 'All' || t.template_category === selectedCategory;
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.template_tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Choose a Template</h2>
                    <p className="text-gray-400">Start with a professionally designed menu</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search templates..."
                        className="pl-9 bg-white/5 border-white/10 text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-2 p-1">
                    {CATEGORIES.map((cat) => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            className={`rounded-full ${selectedCategory === cat
                                    ? "bg-cyan-500 hover:bg-cyan-600 text-white border-transparent"
                                    : "bg-transparent border-white/20 text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {/* Grid */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    No templates found matching your criteria.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <Card key={template.id} className="glass-card overflow-hidden border-white/10 bg-white/5 hover:border-cyan-500/50 transition-all duration-300 group">
                            <div className="aspect-video relative overflow-hidden bg-gray-900">
                                <img
                                    src={template.preview_image_url || 'https://via.placeholder.com/600x400?text=No+Preview'}
                                    alt={template.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button variant="secondary" size="sm" className="gap-2">
                                        <Eye className="w-4 h-4" /> Preview
                                    </Button>
                                </div>
                                <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white border-none">
                                    {template.template_category}
                                </Badge>
                            </div>

                            <CardHeader className="pb-2">
                                <CardTitle className="text-xl text-white">{template.name}</CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {template.template_tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold"
                                            onClick={() => {
                                                setSelectedTemplate(template);
                                                setNewMenuName(`${template.name} Copy`);
                                            }}
                                        >
                                            <Copy className="w-4 h-4 mr-2" /> Use Template
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-slate-900 border-white/10 text-white sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle>Create Menu from Template</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="menuName">Menu Name</Label>
                                                <Input
                                                    id="menuName"
                                                    value={newMenuName}
                                                    onChange={(e) => setNewMenuName(e.target.value)}
                                                    className="bg-white/5 border-white/10 text-white"
                                                />
                                            </div>
                                            <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
                                                <p className="text-sm text-blue-200">
                                                    This will import all sections, categories, items, and design settings from
                                                    <strong> {selectedTemplate?.name}</strong>. You can edit everything afterwards.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => selectedTemplate && handleUseTemplate(selectedTemplate)}
                                            disabled={isCloning === selectedTemplate?.id}
                                            className="w-full bg-cyan-500 hover:bg-cyan-600"
                                        >
                                            {isCloning === selectedTemplate?.id ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...
                                                </>
                                            ) : (
                                                'Create Menu'
                                            )}
                                        </Button>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
