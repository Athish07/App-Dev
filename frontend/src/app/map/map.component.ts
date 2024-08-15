import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { MyServiceService } from '../my-service.service';
import { JobPosting } from '../interface'; // Ensure this points to the correct file

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public map!: L.Map;
  public centroid: L.LatLngExpression = [11.0168, 76.9558]; // Default to Coimbatore
  public locations: { lat: number, lon: number, name: string }[] = [];
  public jobDetails: JobPosting[] = [];
  public uniqueLocations: string[] = [];

  constructor(private dataService: MyServiceService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAddressesFromBackend();
    this.initMap();
  }

  private fetchAddressesFromBackend(): void {
    this.dataService.getjobDetails().subscribe(
      (res: JobPosting[]) => {
        this.jobDetails = res;
        this.uniqueLocations = [...new Set(res.map(job => job.location))];
        res.forEach(job => this.geocodeAddress(job.location, job));
      },
      error => {
        console.error('Error loading job details:', error);
      }
    );
  }

  private geocodeAddress(address: string, job: JobPosting): void {
    this.http.get<any[]>(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
      .subscribe(response => {
        if (response && response.length > 0) {
          const { lat, lon } = response[0];
          this.locations.push({ lat: parseFloat(lat), lon: parseFloat(lon), name: job.location });
          this.addMarker(lat, lon, job.location);
        } else {
          console.error(`No results found for address: ${address}`);
        }
      }, error => {
        console.error('Error geocoding address:', error);
      });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 12,
      maxZoom: 25,  
      minZoom: 0,
      zoomControl: true
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 25,
      minZoom: 0,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private addMarker(lat: number, lon: number, locationName: string): void {
    if (!this.map) {
      this.initMap();
    }

    const jobsAtLocation = this.jobDetails.filter(job => job.location === locationName);
    let popupContent = `<div class="job-popup"><strong>Jobs at ${locationName}</strong><ul class="list-group">`;

    jobsAtLocation.forEach(job => {
      popupContent += `
        <li class="list-group-item">
          <strong>${job.jobTitle}</strong><br>
          <em>${job.companyName}</em><br>
          <strong>Stipend:</strong> ${job.stipend}<br>
          <strong>Apply By:</strong> ${job.applyBy}<br>
          <a href="${job.jobLink}" target="_blank">More Details</a>
        </li>
      `;
    });

    popupContent += `</ul></div>`;

    L.marker([lat, lon], { icon: this.getIcon() })
      .addTo(this.map)
      .bindPopup(popupContent);
  }

  public getIcon() {
    return L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
  }

  public filterJobs(location: string): void {
    const filteredLocations = this.locations.filter(loc => loc.name === location);
    if (filteredLocations.length > 0) {
      const { lat, lon } = filteredLocations[0];
      this.map.setView([lat, lon], 14); // Zoom to the selected location
    }
    this.updateMarkers(filteredLocations);
  }

  private updateMarkers(filteredLocations: { lat: number, lon: number, name: string }[]): void {
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.map.removeLayer(layer);
      }
    });
    filteredLocations.forEach(location => {
      this.addMarker(location.lat, location.lon, location.name);
    });
  }
}
