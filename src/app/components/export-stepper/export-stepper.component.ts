import { Component, OnDestroy } from '@angular/core';
import { FuraffinityService, SubmissionPage } from 'src/app/services/furaffinity.service';
import { Subscription } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'export-stepper',
  templateUrl: './export-stepper.component.html',
  styleUrls: ['./export-stepper.component.css']
})
export class ExportStepperComponent implements OnDestroy {
  public loading: boolean = false;
  public generated: boolean = false;
  public generating: boolean = false;
  public percentDone: number = 0;
  public data: SubmissionPage[] = [];
  public json: string;
  private countSubscription: Subscription = Subscription.EMPTY;

  constructor(private service: FuraffinityService) {
    this.countSubscription = service.countObserver.subscribe(count => {
      this._updatePercentageDone(count);
    });
  }

  ngOnDestroy() {
    this.countSubscription.unsubscribe();
  }

  public async startExport() {
    this.loading = true;
    this.service.loadAllSubmissions()
      .then(res => {
        this.data = res;
      })
      .catch(() => { })
      .finally(() => this.loading = false);
  }

  public restart(): void {
    location.reload();
  }

  public generateExport(): void {
    this.generating = true;
    this.percentDone = 0;
    this.json = null;
    this.generated = true;
    this.service.fetchSubmissionData(this.getSubmissionsToExport())
    .then(() => {
      const records = this.getSubmissionsToExport().filter(r => r.data).map(r => r.data);
      this.json = JSON.stringify(records, null, 1);
    })
    .catch(err => {
      alert('A vague error occurred');
    })
    .finally(() => this.generating = false);
  }

  public getSubmissionsToExport(): SubmissionPage[] {
    return this.data.filter(d => !d.skip);
  }

  public getEstimatedExportTime(): number {
    return Math.ceil(Number(((this.getSubmissionsToExport().length * 7) / 60).toFixed(2))); // right now it takes 7+ seconds per due to arbitrary throttling
  }

  public unselectAll(): void {
    for (let i = 0; i < this.data.length; i++) {
        this.data[i].skip = true;
    }
  }

  public saveExportString(): void {
    const blob = new Blob([this.json], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `fa_export_${Date.now()}.faxp`);
  }

  private _updatePercentageDone(count: number): void {
    if (!count) this.percentDone = 0;
    else this.percentDone = Number(((count / this.getSubmissionsToExport().length) * 100).toFixed(2));
  }

}
