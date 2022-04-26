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
  img3URL: any;
  public message: string | undefined;
  index = 1;
  limit = 10
  layersToMerge:any = []
  randomAsset: any = {};
  hashArray: any = [];
  collectionArray:any = []
  srcIMG:string = ''
  metadata:any = { };
  metadataArray:any  = [];
  characterCount: number = 64;
  switch = false

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
        // should return an object with one index from each category  {categoryName:index}
  generateRandonAsset() {

    let randonAsset:any = {};

    this.categories.forEach( category => {
      randonAsset[category.name] = this.getRandomInt(0, category.files.length);
    })


    return randonAsset;



 /*
     this.randomAsset = []

    this.categories.forEach(categorie => {
      let asset = categorie.files[this.getRandomInt(0, categorie.files.length)]
      let assetName = asset.name.substring(0, (asset.name.length - 4))

      const reader = new FileReader();
      reader.readAsDataURL(asset)
      reader.onload = async () => {
        this.randomAsset.push(
          {asset: reader.result, assetName, categorieName: categorie.name}
        )
      };

    })

  for (const layer of this.randomAsset) {
    const i1: number = this.randomAsset.indexOf(layer);
    this.layersToMerge.push(layer.asset)
    console.log(i1)
    console.log(this.randomAsset.length-1)
    if (i1 == this.randomAsset.length - 1) {
      this.img3URL = await mergeImages(this.layersToMerge)
      this.metadata.src = this.img3URL;
      console.log('teste')
      return this.randomAsset;
    }
  }
 */
}

  // well, if you need explanation for this, you shouldn't be reading it.
  cleanCategories() {
    this.categories = []
  }
       // this should loop over collection length, in each loop hash an randon asset verify if its unique then add in hashedArray and collectionArray.
  generateCollection() {

    this.collectionArray = []
    this.hashArray = []
    this.index = 1;

    while(this.index <= this.limit) {
      let randonAsset = this.generateRandonAsset();

      let hashedObject = hash(randonAsset)

      let duplicate = this.hashArray.find((hash:any) => hash == hashedObject)

      if(!duplicate) {

        this.hashArray.push(hashedObject)

        this.collectionArray.push(randonAsset)

        this.index += 1;

      }
    }

    console.log(this.collectionArray)


  }

  ngOnInit(): void {

  }
  // this should set the img3Url to an base64 img url string from an asset inside collection chose randomly
  generateRandonPreviewFromCollection() {

    // reset the last render
    this.img3URL = '';
    this.layersToMerge = []

    // first lets gather the randon asset to be rendered
    let asset = this.collectionArray[this.getRandomInt(0, this.collectionArray.length)]

   // then we need to get each layer file as an URL to merge with 'merge-image'
    this.categories.forEach(categorie => {
      const reader = new FileReader();
      reader.readAsDataURL(categorie.files[asset[categorie.name]])
      reader.onload = async () => {
        this.layersToMerge.push(reader.result)
        if(this.layersToMerge.length == this.categories.length) {
          //then finally setting the img3URL to the merge
          this.img3URL = await mergeImages(this.layersToMerge);
        }
      };
    })

  }

  //TODO description
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

  // it wll get the id of an asset in the collection, then translating the name of each trait, then merging all layers into one base64 img and returning it
 async renderAssetById(id:any) {



    this.img3URL = '';
    let layersToMerge: (string | ArrayBuffer | null)[] = []
    let asset = this.collectionArray[id];
    let oldNumber = 0

    this.categories.forEach((layer:any) => {
      oldNumber = asset[layer.name]
      asset[layer.name] = layer.files[asset[layer.name]].name
      const reader = new FileReader();
      reader.readAsDataURL(layer.files[oldNumber])

      reader.onload = async () => {
        layersToMerge.push(reader.result)
        if(layersToMerge.length == this.categories.length) {
          asset['src'] = await mergeImages(layersToMerge);
          return new Promise(resolve => setTimeout(() => resolve(asset), 0))
        }
      };

    })




}

  generateMetadata(coinName: string, projectName: string, description: string) {

    this.metadata = {};

    if(this.collectionArray.length == 0 ) {
      alert('you should generate a collection first')
    }
    if (description.length > this.characterCount) {
      alert("description can't be larger than 64 characters")
    }

    switch (coinName) {

      case 'ada':

        let promisesArray: any[] = []

        this.collectionArray.forEach( async (nft:any)  => {

          promisesArray.push(
            this.renderAssetById(this.collectionArray.indexOf(nft, 0))
          )

          this.metadata = {
            ProjectName: projectName,
            Description: description,
            type: 'image/png',
            src: ''
          }

          this.metadataArray.push(this.metadata)

        })

        console.log(promisesArray)


        Promise.all(promisesArray).then(() => {
          console.log('collection array??????', this.collectionArray)
          this.switch = true;
        })

        break
      case 'eth':

        break
    }
  }

}
