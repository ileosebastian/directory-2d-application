import { Pipe, PipeTransform } from '@angular/core';
import { isAPlace } from '../../../core/shared/utils/is-a-place.util';
import { isAnEntry } from '../../../core/shared/utils/is-an-entry.util';


@Pipe({
  name: 'filterPointsAndCategory',
  standalone: true
})
export class FilterPointsAndCategoryPipe implements PipeTransform {

  transform<T>(
    value: { [key: string]: T[] } | null,
    text: string = ''
  ): { [key: string]: T[] } | null {

    if (text === '' || text.length === 0) return value;
    if (value === null || !value) return value;

    text = text.toLowerCase();

    // if text is valid and value it's not empty, filter by professor name de array of professors
    const categories = Object.keys(value);

    const result: { [key: string]: T[] } = {};

    categories.forEach(category => {
      const items = value[category];
      const possibleResults = items
        .filter(item => 
          (isAPlace(item) || isAnEntry(item)) && // if is a place or entry 
          item.title?.toLocaleLowerCase().includes(text) // and matches the text
        );

      if (possibleResults && possibleResults.length > 0) {
        result[category] = possibleResults;
      }
    });

    return result;
  }

}
