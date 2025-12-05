export interface MapData {
    id: string;
    name: string;
    imageUrl: string;
  }
  
  export const CS2_MAPS: MapData[] = [
    {
      id: "dust2",
      name: "Dust II",
      imageUrl: "/maps/dust2.png" // Caminho relativo local
    },
    {
      id: "mirage",
      name: "Mirage",
      imageUrl: "/maps/mirage.png"
    },
    {
      id: "inferno",
      name: "Inferno",
      imageUrl: "/maps/inferno.png"
    },
    {
      id: "nuke",
      name: "Nuke",
      imageUrl: "/maps/nuke.png"
    }
  ];