import { Component } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { latLng, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [LeafletModule],
  templateUrl: './map.html',
  styleUrl: './map.css',
})
export class Map {
  private map!: L.Map;
  protected readonly options: L.MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909)
  };

  onMapReady(map: L.Map): void {
    this.map = map;
    this.locateUser();
  }

  private locateUser(): void {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;

        const userLatLng = L.latLng(latitude, longitude);

        this.map.setView(userLatLng, 15);

        L.marker(userLatLng)
          .addTo(this.map)
          .bindPopup('You are here')
          .openPopup();

        L.circle(userLatLng, {
          radius: accuracy,
          color: 'blue',
          fillOpacity: 0.15
        }).addTo(this.map);
      },
      error => {
        console.error('Geolocation error:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }
}
