import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';


// @ts-ignore
import mergeImages from 'merge-images';
const hash = require('object-hash');

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
  limit = 1001
  layersToMerge:any = []
  randomAsset: any = [];
  hashArray: any = [];
  collectionArray:any = []
  srcIMG:string = ''
  metadata:any = { attributes: [], src: '' };

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


  uploadImage(event: any, index: any) {
    if (event.target.files && event.target.files[0] ) {
      const reader = new FileReader();
      reader.onload = () => {
        this.categories[index].files = event.target.files;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async getSrcImageUrl() {
    this.metadata['src'] = await mergeImages(this.layersToMerge);
  }

  async setPreviewImgUrl() {
    this.imgUR3L = await mergeImages(this.layersToMerge);
  }

  generateRandonAsset(collection:boolean) {

    this.categories.forEach(categorie => {

      let asset = categorie.files[this.getRandomInt(0, categorie.files.length)]
      let assetName = asset.name.substr(0, (asset.name.length - 4))

      this.randomAsset.push(
        {asset, assetName, categorieName: categorie.name, src:''}
      )
    })



    for (let i = 0; i < this.randomAsset.length; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(this.randomAsset[i].asset)
      reader.onload = async () => {
        this.layersToMerge.push(reader.result);
        this.metadata['attributes'].push({trait_type:this.randomAsset[i].categorieName, value: this.randomAsset[i].assetName})
        if (i == (this.randomAsset.length - 1)) {

         await Promise.all(
            [this.getSrcImageUrl(), this.setPreviewImgUrl()]
          )
        }
      };
    }
  }

  CleanCategories() {
    this.categories = []
  }

 async generateCollection() {

    console.log('a')

    this.randomAsset = []

    await this.generateRandonAsset(true);

    let hashedAsset = hash(this.randomAsset);

    let findDuplicate = this.hashArray.find((asset: any) => asset == hashedAsset);

    if(findDuplicate) {
      await this.generateCollection()
    } else {
      this.collectionArray.push(this.randomAsset);
      this.index++
    }

    if (this.index > this.limit) {
      console.log(this.collectionArray)
      this.index = 1
      return
    } else {
      console.log(this.index);
      await this.generateCollection()
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
