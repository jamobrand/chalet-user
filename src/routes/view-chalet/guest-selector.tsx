import { Button } from "@/components/ui/button";

const GuestSelector = ({ 
    guests, 
    setGuests,
    maxGuests 
  }: { 
    guests: { adults: number; children: number; infants: number };
    setGuests: React.Dispatch<React.SetStateAction<{ adults: number; children: number; infants: number }>>;
    maxGuests: number;
  }) => {
    const totalGuests = guests.adults + guests.children;
  
    const updateGuests = (type: keyof typeof guests, operation: 'add' | 'subtract') => {
      setGuests(prev => {
        const newCount = operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1);
        
        // For infants, don't count towards total guests limit
        if (type === 'infants') {
          return { ...prev, [type]: newCount };
        }
        
        // For adults and children, check against maxGuests
        const newTotal = type === 'adults' || type === 'children'
          ? totalGuests + (operation === 'add' ? 1 : -1)
          : totalGuests;
          
        if (newTotal > maxGuests && operation === 'add') {
          return prev;
        }
        
        return { ...prev, [type]: newCount };
      });
    };
  
    return (
      <div className="p-4 space-y-4">
        {Object.entries(guests).map(([type, count]) => (
          <div key={type} className="flex items-center justify-between py-2">
            <div>
              <div className="font-medium capitalize">{type}</div>
              <div className="text-sm text-gray-500">
                {type === 'adults' ? 'Age 13+' : type === 'children' ? 'Ages 2-12' : 'Under 2'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuests(type as keyof typeof guests, 'subtract')}
                disabled={type === 'adults' ? count <= 1 : count <= 0}
                className="h-8 w-8"
              >
                -
              </Button>
              <span className="w-8 text-center">{count}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateGuests(type as keyof typeof guests, 'add')}
                disabled={
                  type === 'infants' 
                    ? count >= 5 
                    : totalGuests >= maxGuests && (type === 'adults' || type === 'children')
                }
                className="h-8 w-8"
              >
                +
              </Button>
            </div>
          </div>
        ))}
        <div className="text-sm text-gray-500 pt-2">
          This place has a maximum of {maxGuests} guests, not counting infants
        </div>
      </div>
    );
  };

  export default GuestSelector;