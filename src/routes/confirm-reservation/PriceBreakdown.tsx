import { Separator } from "@/components/ui/separator";
import { Addon, SelectedAddons } from "./addon-selector";

export const PriceBreakdown = ({ 
    totalAmount, 
    taxAmount, 
    selectedAddons, 
    addons 
  }: { 
    totalAmount: number;
    taxAmount: number;
    selectedAddons: SelectedAddons;
    addons: Addon[];
  }) => (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-600">Sub Total</span>
        <span>
          KES {Number(totalAmount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      {addons.map(addon => 
        selectedAddons[addon.id] && (
          <div key={addon.id} className="flex justify-between">
            <span className="text-gray-600">{addon.name}</span>
            <span>
              KES {parseInt(addon.price).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        )
      )}
      <div className="flex justify-between">
        <span className="text-gray-600">Taxes (16%)</span>
        <span>
          KES {Number(taxAmount).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>
          KES {Number(totalAmount + taxAmount + addons.reduce((total, addon) => 
            total + (selectedAddons[addon.id] ? parseInt(addon.price) : 0), 0
          )).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );