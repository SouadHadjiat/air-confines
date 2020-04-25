
export class CityQuiz {
  cityName: string;
  countryName: string;
  description: string;
  photoFileName: string;

  constructor(data: any) {
    this.cityName = data.cityName;
    this.countryName = data.countryName;
    this.description = data.description;
    this.photoFileName = data.photoFileName;
  }

  checkIsCorrectAnswer(answer: string, locale: string): boolean {
    return answer && this.cityName.localeCompare(answer, locale, {sensitivity: "base"}) == 0
  }
}
