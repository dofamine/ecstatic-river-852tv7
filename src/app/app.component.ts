import { NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgStyle],
  providers: [HttpClient],
  template: `
    <h1>{{ tableName }}</h1>
    <table>
      <tr>
        @for (col of colDef; track col) {
        <td
          [ngStyle]="{
            width: col.width + 'px',
            visibility: col.hidden ? 'hidden' : 'visible'
          }"
        >
          {{ col.name }}
        </td>
        }
      </tr>
      @for (record of data; track record) {
      <tr>
        @for (key of getDataKeys(record); track key; let index = $index) {
        <td
          [ngStyle]="{
            visibility: colDef[index].hidden ? 'hidden' : 'visible'
          }"
          (dblclick)="getStatus(record)"
        >
          {{ record[key] }}
        </td>
        }
      </tr>
      }
    </table>
  `,
})
export class TableComponent {
  @Input() data: Array<Record<string, any>>;
  @Input() colDef: Array<IColumnDef>;
  @Input() tableName: string;

  constructor(public http: HttpClient) {}

  getDataKeys(entity: Record<string, any>): string[] {
    return Object.keys(entity);
  }

  getStatus(record: any): void {
    this.http
      .get<any[]>('assets/orders.json')
      .subscribe((res) => alert(res.find(({ id }) => id === record.id).status));
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<app-table
    tableName="My Table"
    [colDef]="colDef"
    [data]="data"
  ></app-table>`,
  imports: [TableComponent],
  providers: [HttpClient],
})
export class AppComponent {
  data: any;
  colDef = [
    { name: 'Order Id', width: 100 },
    { name: 'Name', width: 200 },
    { name: 'Status', hidden: true },
    { name: 'Info', width: 200 },
  ];

  constructor(http: HttpClient) {
    http.get('assets/orders.json').subscribe((res) => (this.data = res));
  }
}

interface IColumnDef {
  name: string;
  hidden?: boolean;
  width?: number;
}
