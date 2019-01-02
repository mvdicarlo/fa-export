import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

export interface SubmissionPage {
  id: string;
  url: string;
  imgUrl: string;
  title: string;
  data?: any;
  skip?: boolean;
}

export interface SubmissionData {
  title: string;
  description: string;
  rating: string;
  tags: string[];
  imageURL: string;
  scraps: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FuraffinityService {
  private readonly URL: string = 'https://www.furaffinity.net';
  public countSubject: Subject<number>;
  public countObserver: Observable<number>;

  constructor(private http: HttpClient) {
    this.countSubject = new Subject();
    this.countObserver = this.countSubject.asObservable();
  }

  public checkLogin(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.get(`${this.URL}`, { responseType: 'text' })
        .pipe(retry(3))
        .subscribe(res => {
          res.includes('Log in') ? reject() : resolve();
        }, err => {
          console.error(err);
          reject();
        });
    });
  }

  public async fetchSubmissionData(submissions: SubmissionPage[]): Promise<any> {
    this.countSubject.next(0);

    for (let i = 0; i < submissions.length; i++) {
      const s = submissions[i];
      if (!s.data) {
        await this._fetchData(s);
      }

      this.countSubject.next(i + 1);
    }
  }

  private _fetchData(submission: SubmissionPage): Promise<void> {
    return new Promise((resolve, reject) => {
      timer(4000).subscribe(() => {

        this.http.get(submission.url, { responseType: 'text' })
          .pipe(retry(3))
          .subscribe((res => {
            const data: any = {};
            const html$ = $.parseHTML(res);
            const img$ = $(html$).find('#submissionImg');
            data.imageURL = `https:${img$.attr('data-fullview-src')}`;
            data.title = submission.title;

            timer(3000).subscribe(() => {

              this.http.get(`${this.URL}/controls/submissions/changeinfo/${submission.id}`, { responseType: 'text' })
                .pipe(retry(3))
                .subscribe(info => {
                  const html$ = $.parseHTML(info);
                  data.description = $(html$).find('[name="message"]').text();
                  data.rating = this._convertRating($(html$).find('[name="rating"]:checked').prop('value'));
                  data.scraps = $(html$).find('[name="scrap"]').prop('checked');
                  data.tags = ($(html$).find('[name="keywords"]').text() || '').split(' ');

                  submission.data = data;
                  resolve();
                }, err => {
                  console.error(err);
                  reject();
                });

            });

          }), err => {
            console.error(err);
            reject();
          });

      });
    });
  }

  public async loadAllSubmissions(): Promise<SubmissionPage[]> {
    let data: SubmissionPage[] = [];

    let count: number = 0;
    while (true) { // yeah im using a while true... deal with it
      const pageData: SubmissionPage[] = await this._loadSubmissions(count);
      count++;

      if (pageData) {
        data = [...data, ...pageData];
      } else {
        break;
      }
    }

    return data;
  }

  public _loadSubmissions(page: number = 0): Promise<SubmissionPage[]> {
    return new Promise((resolve, reject) => {
      timer(2000).subscribe(() => {

        this.http.get(`${this.URL}/controls/submissions/${page}`, { responseType: 'text' })
          .pipe(retry(3))
          .subscribe(res => {
            try {
              const items: SubmissionPage[] = [];
              const html$ = $.parseHTML(res);
              const figs$ = $(html$).find('figure');

              if (figs$.length > 0) {
                $(figs$).each((index, item) => {
                  try {
                    const view = $(item).find('a');
                    const img = $(item).find('img');
                    const title = $(item).find('label');

                    items.push({
                      id: $(item).prop('id').replace('sid-', ''),
                      url: `https://www.furaffinity.net/${view.prop('href').replace('file:///', '')}`,
                      imgUrl: `https://${img.prop('src').replace('file://', '')}`,
                      title: title.text(),
                      data: null,
                      skip: false
                    });
                  } catch (e) {
                    console.error('Skipping one');
                    console.error(e);
                  }
                });
              }

              resolve(items.length > 0 ? items : null);
            } catch (e) {
              console.error(e);
              resolve(null);
            }
          }, err => {
            console.error(err);
            resolve(null);
          });

      });
    });
  }

  private _convertRating(rating: string): string {
    if (rating === '0') return 'General';
    if (rating === '1') return 'Adult';
    if (rating === '2') return 'Mature';
    return 'Unknown';
  }
}
