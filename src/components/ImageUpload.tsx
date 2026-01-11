import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Image as ImageIcon, Link2, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
    currentImage?: string;
    onImageChange: (imageUrl: string) => void;
    itemName: string;
}

export const ImageUpload = ({ currentImage, onImageChange, itemName }: ImageUploadProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState(currentImage || "");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `menu-items/${fileName}`;

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('menu-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) throw error;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('menu-images')
                .getPublicUrl(filePath);

            setImageUrl(publicUrl);
            onImageChange(publicUrl);
            toast.success("Image uploaded successfully!");
            setIsOpen(false);
        } catch (error: any) {
            console.error('Upload error:', error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (!imageUrl.trim()) {
            toast.error("Please enter an image URL");
            return;
        }

        // Basic URL validation
        try {
            new URL(imageUrl);
            onImageChange(imageUrl);
            toast.success("Image URL saved!");
            setIsOpen(false);
        } catch {
            toast.error("Please enter a valid URL");
        }
    };

    const handleRemoveImage = () => {
        setImageUrl("");
        onImageChange("");
        toast.success("Image removed");
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                >
                    {currentImage ? (
                        <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Change Image
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Add Image
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-neon-cyan" />
                        {currentImage ? 'Update' : 'Add'} Image for {itemName}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Image Preview */}
                    {currentImage && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-700">
                            <img
                                src={currentImage}
                                alt={itemName}
                                className="w-full h-48 object-cover"
                            />
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={handleRemoveImage}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {/* Upload Method Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-800 rounded-lg">
                        <button
                            onClick={() => setUploadMethod('upload')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${uploadMethod === 'upload'
                                    ? 'bg-neon-cyan text-black'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Upload className="w-4 h-4 inline mr-2" />
                            Upload File
                        </button>
                        <button
                            onClick={() => setUploadMethod('url')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${uploadMethod === 'url'
                                    ? 'bg-neon-cyan text-black'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Link2 className="w-4 h-4 inline mr-2" />
                            Image URL
                        </button>
                    </div>

                    {/* Upload File */}
                    {uploadMethod === 'upload' && (
                        <div className="space-y-3">
                            <Label className="text-white">Upload Image</Label>
                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-neon-cyan/50 transition-colors">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                                            <p className="text-sm text-slate-400">Uploading...</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-slate-400" />
                                            <p className="text-sm text-white">Click to upload</p>
                                            <p className="text-xs text-slate-500">PNG, JPG, WEBP (max 5MB)</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Image URL */}
                    {uploadMethod === 'url' && (
                        <div className="space-y-3">
                            <Label className="text-white">Image URL</Label>
                            <Input
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="bg-slate-800 border-slate-700 text-white"
                            />
                            <Button
                                onClick={handleUrlSubmit}
                                className="w-full bg-neon-cyan text-black hover:bg-neon-cyan/90"
                            >
                                Save URL
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
