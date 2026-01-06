import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DollarSign,
    FolderMove,
    Tag,
    Trash2,
    Download,
    X
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface BulkOperationsPanelProps {
    selectedItems: string[];
    onDeselectAll: () => void;
    onBulkPriceChange: (percent: number) => void;
    onBulkMove: (categoryId: string) => void;
    onBulkTag: (tags: string[]) => void;
    onBulkDelete: () => void;
    onExport: () => void;
    categories?: { id: string; name: string }[];
}

export const BulkOperationsPanel = ({
    selectedItems,
    onDeselectAll,
    onBulkPriceChange,
    onBulkMove,
    onBulkTag,
    onBulkDelete,
    onExport,
    categories = [],
}: BulkOperationsPanelProps) => {
    const [showPriceDialog, setShowPriceDialog] = useState(false);
    const [showMoveDialog, setShowMoveDialog] = useState(false);
    const [showTagDialog, setShowTagDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const [pricePercent, setPricePercent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    if (selectedItems.length === 0) return null;

    const handlePriceChange = () => {
        const percent = parseFloat(pricePercent);
        if (!isNaN(percent)) {
            onBulkPriceChange(percent);
            setShowPriceDialog(false);
            setPricePercent('');
        }
    };

    const handleMove = () => {
        if (selectedCategory) {
            onBulkMove(selectedCategory);
            setShowMoveDialog(false);
            setSelectedCategory('');
        }
    };

    const handleTag = () => {
        if (selectedTags.length > 0) {
            onBulkTag(selectedTags);
            setShowTagDialog(false);
            setSelectedTags([]);
        }
    };

    const handleDelete = () => {
        onBulkDelete();
        setShowDeleteDialog(false);
    };

    const availableTags = [
        { id: 'veg', label: 'Vegetarian' },
        { id: 'non-veg', label: 'Non-Vegetarian' },
        { id: 'bestseller', label: 'Best Seller' },
        { id: 'chef-special', label: "Chef's Special" },
        { id: 'premium', label: 'Premium' },
        { id: 'new', label: 'New Item' },
    ];

    return (
        <>
            <Card className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 to-pink-600 border-none shadow-lg">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <span className="text-white font-bold text-lg">
                            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDeselectAll}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            onClick={() => setShowPriceDialog(true)}
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            <DollarSign className="w-4 h-4 mr-2" />
                            Change Price
                        </Button>

                        <Button
                            onClick={() => setShowMoveDialog(true)}
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            <FolderMove className="w-4 h-4 mr-2" />
                            Move
                        </Button>

                        <Button
                            onClick={() => setShowTagDialog(true)}
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            <Tag className="w-4 h-4 mr-2" />
                            Tags
                        </Button>

                        <Button
                            onClick={onExport}
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>

                        <Button
                            onClick={() => setShowDeleteDialog(true)}
                            variant="destructive"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Price Change Dialog */}
            <Dialog open={showPriceDialog} onOpenChange={setShowPriceDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bulk Price Change</DialogTitle>
                        <DialogDescription>
                            Apply a percentage change to all selected items
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Percentage Change</Label>
                            <Input
                                type="number"
                                placeholder="e.g., 10 for +10%, -5 for -5%"
                                value={pricePercent}
                                onChange={(e) => setPricePercent(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowPriceDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handlePriceChange}>
                                Apply Change
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Move Dialog */}
            <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move Items</DialogTitle>
                        <DialogDescription>
                            Move selected items to a different category
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Target Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleMove}>
                                Move Items
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Tag Dialog */}
            <Dialog open={showTagDialog} onOpenChange={setShowTagDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manage Tags</DialogTitle>
                        <DialogDescription>
                            Add or remove tags from selected items
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {availableTags.map((tag) => (
                                <div key={tag.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={tag.id}
                                        checked={selectedTags.includes(tag.id)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedTags([...selectedTags, tag.id]);
                                            } else {
                                                setSelectedTags(selectedTags.filter((t) => t !== tag.id));
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={tag.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {tag.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setShowTagDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleTag}>
                                Apply Tags
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Items</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete {selectedItems.length} Item{selectedItems.length !== 1 ? 's' : ''}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
