import {
  Directive,
  DoCheck,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * Repeat the inner children the given number of times.
 */
@Directive({
  selector: '[repeat]',
})
export class RepeatDirective implements DoCheck {
  private count: number = 0;
  private isDirty = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private containerView: ViewContainerRef
  ) {}

  /**
   * Repeat the inner children the given number of times.
   */
  @Input()
  set repeat(count: number) {
    if (count < 0) {
      throw new Error(
        `Invalid count, expected positive number but was ${count}`
      );
    }

    this.count = count;
  }

  ngDoCheck(): void {
    if (this.isDirty) {
      this.isDirty = false;

      for (let i = 0; i < this.count; i++) {
        this.containerView.createEmbeddedView(this.templateRef);
      }
    }
  }
}
