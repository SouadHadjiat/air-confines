
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

  checkIsCorrectAnswer(answer: string): boolean {
    return answer && this.cityName.toLowerCase() == answer.toLowerCase()
  }
}
