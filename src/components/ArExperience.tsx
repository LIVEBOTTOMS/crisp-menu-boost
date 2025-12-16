import { useState, useEffect, useRef } from "react";
import { X, RotateCcw, Maximize2, Minimize2, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArExperienceProps, MenuItemArAsset, ApiResponse } from "@/types/worldClass";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const ArExperience = ({ menuItemId, onClose }: ArExperienceProps) => {
    const [arAssets, setArAssets] = useState<MenuItemArAsset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<MenuItemArAsset | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [rotation, setRotation] = useState(0);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchArAssets();
    }, [menuItemId]);

    const fetchArAssets = async () => {
        try {
            // For now, use mock data until database migration is applied
            // TODO: Replace with actual Supabase query once migration is run
            const mockArAssets: MenuItemArAsset[] = [
                {
                    id: 'mock-1',
                    menu_item_id: menuItemId,
                    asset_type: '360_photo',
                    asset_url: '/public/placeholder.svg', // Placeholder until real assets are uploaded
                    thumbnail_url: '/public/placeholder.svg',
                    file_size_bytes: 1024000,
                    format: 'jpg',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: 'mock-2',
                    menu_item_id: menuItemId,
                    asset_type: 'video',
                    asset_url: '/public/placeholder.svg', // Placeholder video
                    thumbnail_url: '/public/placeholder.svg',
                    file_size_bytes: 5120000,
                    format: 'mp4',
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ];

            // Uncomment below when database migration is applied
            /*
            const { data, error } = await supabase
                .from('menu_item_ar_assets')
                .select('*')
                .eq('menu_item_id', menuItemId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setArAssets(data || []);
            if (data && data.length > 0) {
                setSelectedAsset(data[0]);
            }
            */

            // Mock implementation
            setArAssets(mockArAssets);
            setSelectedAsset(mockArAssets[0]);
        } catch (error) {
            console.error('Failed to fetch AR assets:', error);
            toast.error('Failed to load AR experience');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssetSelect = (asset: MenuItemArAsset) => {
        setSelectedAsset(asset);
        setIsPlaying(false);
        setRotation(0);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    const togglePlayPause = () => {
        if (!videoRef.current) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const resetView = () => {
        setRotation(0);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    };

    const renderAssetContent = () => {
        if (!selectedAsset) return null;

        switch (selectedAsset.asset_type) {
            case '3d_model':
                return (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
                        <div className="text-center text-white">
                            <div className="text-6xl mb-4">🎯</div>
                            <h3 className="text-xl font-bold mb-2">3D Model Experience</h3>
                            <p className="text-gray-400 mb-4">Interactive 3D view coming soon</p>
                            <div className="flex justify-center space-x-4">
                                <Button
                                    onClick={() => window.open(selectedAsset.asset_url, '_blank')}
                                    className="bg-neon-cyan hover:bg-neon-cyan/80"
                                >
                                    View in Browser
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => toast.info('AR glasses required for full experience')}
                                >
                                    Open in AR
                                </Button>
                            </div>
                        </div>
                    </div>
                );

            case 'video':
                return (
                    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                        <video
                            ref={videoRef}
                            src={selectedAsset.asset_url}
                            className="w-full h-full object-cover"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            controls={false}
                        />
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-2">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={togglePlayPause}
                                className="bg-black/50 hover:bg-black/70"
                            >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={toggleMute}
                                className="bg-black/50 hover:bg-black/70"
                            >
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>
                );

            case '360_photo':
                return (
                    <div
                        className="w-full h-full bg-black rounded-lg overflow-hidden cursor-grab active:cursor-grabbing"
                        style={{
                            backgroundImage: `url(${selectedAsset.asset_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transform: `rotateY(${rotation}deg)`,
                        }}
                        onMouseMove={(e) => {
                            if (e.buttons === 1) { // Left mouse button
                                setRotation(prev => prev + e.movementX * 0.5);
                            }
                        }}
                    >
                        <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-black/50 text-white">
                                360° View - Drag to rotate
                            </Badge>
                        </div>
                    </div>
                );

            case 'animation':
                return (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="text-6xl mb-4 animate-bounce">✨</div>
                            <h3 className="text-xl font-bold mb-2">Animated Experience</h3>
                            <p className="text-gray-300">Interactive animation loading...</p>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="text-4xl mb-4">📁</div>
                            <p className="text-gray-400">Unsupported asset type</p>
                        </div>
                    </div>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
                    <p>Loading AR Experience...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-black/95 flex flex-col z-50"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
                <div>
                    <h2 className="text-xl font-bold text-white">AR Experience</h2>
                    <p className="text-sm text-gray-400">Interactive menu item preview</p>
                </div>
                <div className="flex items-center space-x-2">
                    {selectedAsset && (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={resetView}
                                className="text-white hover:bg-white/10"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={toggleFullscreen}
                                className="text-white hover:bg-white/10"
                            >
                                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                        </>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onClose}
                        className="text-white hover:bg-white/10"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex">
                {/* Main Content */}
                <div className="flex-1 p-4">
                    <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden">
                        {selectedAsset ? renderAssetContent() : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🎨</div>
                                    <h3 className="text-xl font-bold mb-2">No AR Assets Available</h3>
                                    <p className="text-gray-400">This menu item doesn't have AR experiences yet.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Asset Selector Sidebar */}
                {arAssets.length > 1 && (
                    <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
                        <h3 className="text-lg font-semibold text-white mb-4">Available Experiences</h3>
                        <div className="space-y-3">
                            {arAssets.map((asset) => (
                                <Card
                                    key={asset.id}
                                    className={`cursor-pointer transition-all duration-200 ${selectedAsset?.id === asset.id
                                        ? 'bg-neon-cyan/20 border-neon-cyan'
                                        : 'bg-slate-700 border-slate-600 hover:bg-slate-600'
                                        }`}
                                    onClick={() => handleAssetSelect(asset)}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="text-2xl">
                                                {asset.asset_type === '3d_model' && '🎯'}
                                                {asset.asset_type === 'video' && '🎬'}
                                                {asset.asset_type === '360_photo' && '📷'}
                                                {asset.asset_type === 'animation' && '✨'}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white capitalize">
                                                    {asset.asset_type.replace('_', ' ')}
                                                </p>
                                                <p className="text-xs text-gray-400 uppercase">
                                                    {asset.format}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="p-4 bg-slate-900 border-t border-slate-700">
                <div className="text-center text-sm text-gray-400">
                    {selectedAsset?.asset_type === '360_photo' && (
                        <p>🖱️ Drag to rotate • 🔍 Scroll to zoom • 📱 Touch and drag on mobile</p>
                    )}
                    {selectedAsset?.asset_type === 'video' && (
                        <p>▶️ Click play to start • 🔊 Adjust volume • 📱 Touch controls available</p>
                    )}
                    {selectedAsset?.asset_type === '3d_model' && (
                        <p>🌐 View in your browser • 📱 AR glasses recommended for full experience</p>
                    )}
                </div>
            </div>
        </div>
    );
};
