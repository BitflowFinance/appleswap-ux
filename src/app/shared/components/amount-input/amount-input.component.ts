import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs'

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
  styleUrls: ['./amount-input.component.css']
})
export class AmountInputComponent implements OnInit, AfterViewInit {
  @Input()
  placeholder = ''

  @Input()
  disabled = false

  @Input()
  valueIsLoading = false

  @Input()
  min = 1

  @Input()
  max?: number

  @Input()
  prefixValue = ''

  @Input()
  prefixStyleType: 'primary' | 'secondary' = 'primary'

  @Input()
  hasPrefix = true

  @Input()
  isSliderAmount = false

  @Input()
  noMinHeight = false

  @Input()
  value = 0

  @Output()
  valueChange = new EventEmitter<number>()

  @Output()
  onEndEditing = new EventEmitter<number>()

  @Output()
  keyup = new EventEmitter<KeyboardEvent>()

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(this.inputRef.nativeElement, 'input')
      .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
      .pipe(debounceTime(1000)) // wait 1 second after the last user input before emitting the value
      .pipe(distinctUntilChanged()) // only emit if the value is different from the previous value
      .subscribe((value) => this.onEndEditing.emit(+value))
  }

  onInput(event: Event) {
    if (this.disabled) return
    this.valueChange.emit(+(event.target as HTMLInputElement).value)
  }

  onKeyUp(event: KeyboardEvent) {
    if (this.disabled) return
    this.keyup.emit(event)
  }
}
