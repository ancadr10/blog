import { AfterViewInit, Directive, ElementRef, HostBinding, HostListener, OnDestroy, Renderer2 } from "@angular/core";

@Directive({
    selector: '[toggleLayout]',
    standalone: true
})
export class ToggleLayoutDirective implements AfterViewInit, OnDestroy {

    leftSideOfLayout!: HTMLElement;
    rightSideOfLayout!: HTMLElement;
    containerLayout!: HTMLElement;
    matIcon!: HTMLElement;

    @HostBinding('class.btn-reduce') isActive = false;
    @HostBinding('attr.data-state') get dataState() { return this.isActive ? 'reduce' : 'increase'; }

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    ngAfterViewInit(): void {
        this.rightSideOfLayout = this.el.nativeElement.parentElement;
        this.containerLayout = this.el.nativeElement.parentElement.parentElement;
        this.leftSideOfLayout = this.el.nativeElement.parentElement.parentElement.childNodes[0];

        this.matIcon = this.el.nativeElement.querySelector('mat-icon');
        if (!this.matIcon) {
            console.error('Nu s-au găsit mat-icon sau textul butonului!');
        }
    }

    private addClass(className: string) {
        this.renderer.addClass(this.el.nativeElement, className);
    }

    private removeClass(className: string) {
        this.renderer.removeClass(this.el.nativeElement, className);
    }

    @HostListener('click')
    onClickToggleLayout() {
        this.isActive = !this.isActive;
        const button = this.el.nativeElement;
        const matIcon = button.querySelector('mat-icon');

        if (this.isActive) {
            this.removeClass('btn-increase');
            this.addClass('btn-reduce');
            
            if (matIcon) matIcon.innerText = 'arrow_forward'; // reduce

            this.leftSideOfLayout.className = 'display-none';
            this.rightSideOfLayout.className = 'right-side';
            this.containerLayout.className = 'grid grid-cols-1';
        } else {
            this.addClass('btn-increase');
            this.removeClass('btn-reduce');

            if (matIcon) matIcon.innerText = 'arrow_back';    // expand

            this.leftSideOfLayout.className = '';
            this.rightSideOfLayout.className = 'side-shadow';
            this.containerLayout.className = 'grid grid-cols-2 h-[100vh] overflow-auto';
        }
    }

    ngOnDestroy(): void {

    }
}