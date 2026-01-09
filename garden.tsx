import { PlantCard } from '@/components/garden/plant-card';
import { plantData } from '@/lib/plant-data';
import type { Plant } from '@/lib/plant-data';

export default function GardenPage() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
          Explore the Virtual Garden
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover the rich world of medicinal plants used in AYUSH. Click on a plant to learn more about its properties and traditional uses.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plantData.map((plant: Plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  );
}
