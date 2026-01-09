'use client';

import Link from 'next/link';
import { plantData, getPlantImage } from '@/lib/plant-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';

const mapAreas = [
    { name: 'Herb Garden', x: '25%', y: '25%' },
    { name: 'Medicinal Grove', x: '75%', y: '30%' },
    { name: 'Wetland Patch', x: '30%', y: '75%' },
    { name: 'Spice Corner', x: '70%', y: '70%' },
];

function GardenMapBackground() {
    return (
        <svg
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
        >
            <defs>
                <radialGradient id="grad-pond" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--primary)/0.3)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(var(--primary)/0.5)', stopOpacity: 1 }} />
                </radialGradient>
                 <linearGradient id="grad-path" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--secondary))', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: 'hsl(var(--secondary)/0.8))', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(var(--secondary))', stopOpacity: 1 }} />
                </linearGradient>
            </defs>
            {/* Base ground color */}
            <rect width="800" height="600" fill="hsl(var(--background))" />
            
            {/* Garden Beds */}
            <path d="M50,50 Q150,20 250,50 T450,50" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--border))" strokeWidth="1"/>
            <path d="M550,50 Q650,30 750,60 L750,250 Q650,280 550,250 Z" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--border))" strokeWidth="1"/>
            <path d="M50,450 Q150,420 250,450 T450,450 L450,550 L50,550 Z" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--border))" strokeWidth="1"/>
            <path d="M550,400 Q650,380 750,410 L750,550 L550,550 Z" fill="hsl(var(--primary)/0.1)" stroke="hsl(var(--border))" strokeWidth="1"/>

            {/* Path */}
            <path d="M500,0 V600" stroke="url(#grad-path)" strokeWidth="60" strokeLinecap="round" />
            <path d="M0,300 H800" stroke="url(#grad-path)" strokeWidth="50" strokeLinecap="round" />

            {/* Pond */}
            <ellipse cx="250" cy="300" rx="120" ry="80" fill="url(#grad-pond)" stroke="hsl(var(--primary)/0.6)" strokeWidth="2"/>
            
        </svg>
    );
}


export default function ExplorerMapPage() {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                    Herbal Garden Explorer
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Hover over a plant to discover its name, and click to learn more about its story and uses.
                </p>
            </div>

            <div className="relative w-full aspect-[4/3] max-w-5xl mx-auto rounded-lg shadow-2xl overflow-hidden border-4 border-card">
                <GardenMapBackground />
                <TooltipProvider>
                    <div className="relative w-full h-full">
                        {/* Map Area Labels */}
                        {mapAreas.map(area => (
                            <div
                                key={area.name}
                                className="absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: area.x, top: area.y }}
                            >
                                <div className="text-sm font-bold text-primary/70 tracking-widest uppercase py-1 px-2 rounded bg-background/50">
                                    {area.name}
                                </div>
                            </div>
                        ))}

                        {/* Plant Icons */}
                        {plantData.filter(p => p.mapPosition).map((plant) => {
                            const image = getPlantImage(plant);
                            if (!image) return null;

                            return (
                                <Tooltip key={plant.id} delayDuration={100}>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={`/plants/${plant.slug}`}
                                            className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-125 hover:z-10 group"
                                            style={{
                                                left: `${plant.mapPosition?.x}%`,
                                                top: `${plant.mapPosition?.y}%`,
                                            }}
                                        >
                                            <div className="relative w-10 h-10 rounded-full shadow-lg overflow-hidden border-2 border-background/80 group-hover:border-primary transition-all">
                                                <Image
                                                    src={image.imageUrl}
                                                    alt={plant.commonName}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover"
                                                    data-ai-hint={image.imageHint}
                                                />
                                            </div>
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-bold">{plant.commonName}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                </TooltipProvider>
            </div>
        </div>
    );
}
