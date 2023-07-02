import type { Staff } from '../../../../shared/types';

// 스태프 하나만 인수를 취했다.
// 익명 함수 필요
export function filterByTreatment(
  staff: Staff[],
  treatmentName: string,
): Staff[] {
  return staff.filter((person) =>
    person.treatmentNames
      .map((t) => t.toLowerCase())
      .includes(treatmentName.toLowerCase()),
  );
}
