import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';


// @ts-ignore
import mergeImages from 'merge-images';

@Component({
  selector: 'app-engine-page',
  templateUrl: './engine-page.component.html',
  styleUrls: ['./engine-page.component.css']
})
export class EnginePageComponent implements OnInit {

  categories: any[] = [];

  public imagePath: any;
  imgUR1L: any;
  imgUR2L: any;
  imgUR3L: any;
  public message: string | undefined;
  index = 1;
  limit = 100
  layersToMerge:any = []
  randomAsset: any = [];

  constructor() { }


  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (
      max - min)) + min;
  }

  addCategorie(name: any) {
    this.categories.push({name: name, files: []});
  }

  preview(files: any) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgUR1L = reader.result;


      reader.readAsDataURL(files[1]);
      reader.onload = async (_event) => {
        this.imgUR2L = reader.result;

        this.imgUR3L = await mergeImages([this.imgUR1L, this.imgUR2L]);

        mergeImages([this.imgUR1L, this.imgUR2L])
          .then((b64: any) => this.imgUR3L = b64);

      }
    }
  }
  uploadImage(event: any, index: any) {
    if (event.target.files && event.target.files[0] ) {
      const reader = new FileReader();
      reader.onload = () => {
        this.categories[index].files = event.target.files;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  generateRandonAsset(collection:boolean) {

    this.categories.forEach(categorie => {

      let asset = categorie.files[this.getRandomInt(0, categorie.files.length)]
      let assetName = asset.name.substr(0, (asset.name.length - 4))

      this.randomAsset.push(
        {asset, assetName}
      )
    })



    for (let i = 0; i < this.randomAsset.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(this.randomAsset[i].asset)



      reader.onload = async () => {
        this.layersToMerge.push(reader.result);

        if (i == (this.randomAsset.length - 1)) {

          if(collection) {
            return
          }

          setTimeout( async()=> {
            this.imgUR3L = await mergeImages(this.layersToMerge);
          },500)
        }
      };
    }
  }

  CleanCategories() {
    this.categories = []
  }

 async generateCollection() {

   for (let j = 0; j < this.limit; j++) {
     this.randomAsset = []
     await this.generateRandonAsset(true);
     console.log('a')
   }

  }


  ngOnInit(): void {

  }


  getRandomIndexByProbability(probabilities :any) {
    let r = Math.random(),
      index = probabilities.length - 1;

    // @ts-ignore
    probabilities.some(function (probability: number, i: number) {
      if (r < probability) {
        index = i;
        return true;
      }
      r -= probability;
    });
    return index;
  }


}
