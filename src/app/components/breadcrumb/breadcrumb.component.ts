import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Breadcumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent implements OnInit {
  @Input()
  set url(value: string) {
    let parts: string[];

    if (value.startsWith('/')) {
      parts = value.slice(1).split('/');
    } else {
      parts = value.split('/');
    }

    const length = this.skipLast ? parts.length - 1 : parts.length;

    for (let i = 0; i < length; i++) {
      const slice = parts.slice(0, i + 1);
      const label = parts[i];
      const url: string = '/' + slice.join('/');

      this.breadcrumbs.push({
        label,
        url,
      });
    }
  }

  @Input() capitalize = true;
  @Input() skipLast = false;
  breadcrumbs: Breadcumb[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.breadcrumbs.length === 0) {
      this.url = this.router.url;
    }
  }
}
