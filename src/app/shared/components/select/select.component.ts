import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { SelectItem, SelectList } from '../../types/Select'

const PRIMARY_ARROW_PATH = '../../../../assets/icons/arrow-down.svg'
const SECONDARY_ARROW_PATH = '../../../../assets/icons/arrow-down-secondary.svg'

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input()
  list: SelectList = []

  @Input()
  placeholder = 'Select a token'

  @Input()
  arrowType: 'primary' | 'secondary' = 'primary'

  @Input()
  canChange = true

  @Output()
  onChange = new EventEmitter<SelectItem>()

  @Input()
  selectedItem?: SelectItem

  constructor() {}

  ngOnInit(): void {}

  selectionChange(e: SelectItem) {
    this.onChange.emit(e)
  }

  getArrowPathByType() {
    const isPrimary = this.arrowType === 'primary'

    return isPrimary ? PRIMARY_ARROW_PATH : SECONDARY_ARROW_PATH
  }
}
