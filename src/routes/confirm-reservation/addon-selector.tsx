// First, add these types
export interface Addon {
    id: string;
    uniqueId: string;
    name: string;
    description: string;
    price: string;
    createdAt: string;
    updatedAt: string;
    bookingAddons?: any[];
    _count?: {
      bookingAddons: number;
    };
  }

export interface SelectedAddons {
  [key: string]: boolean;
}

// Add this component above ConfirmReservation
export const AddonSelector = ({
  addons,
  selectedAddons,
  onAddonChange,
}: {
  addons: Addon[];
  selectedAddons: SelectedAddons;
  onAddonChange: (addonId: string, isSelected: boolean) => void;
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Additional Services</h2>
      <div className="space-y-4">
        {addons.map((addon) => (
          <div key={addon.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id={addon.id}
                checked={selectedAddons[addon.id] || false}
                onChange={(e) => onAddonChange(addon.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <div>
                <label htmlFor={addon.id} className="font-medium">
                  {addon.name}
                </label>
                <p className="text-sm text-gray-500">{addon.description}</p>
              </div>
            </div>
            <span className="text-gray-900">KES {parseInt(addon.price).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
