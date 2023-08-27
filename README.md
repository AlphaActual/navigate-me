# Navigate me
## Studenti: Tin Pritišanac, Neven Davidović
  [Fakultet informatike u Puli](https://fipu.unipu.hr/) <br>
  
  Kolegij: [ Programsko inženjeratvo](ntankovic.unipu.hr/pi) <br>
  
  Mentor: [ doc. dr. sc. Nikola Tanković](ntankovic.unipu.hr) <br>
  
<b>Link na javni prototip: [ Navigate me](https://navigate-me.netlify.app/) </b>

<b>Kratki opis funkcionalnosti:</b>
- Računanje ukupnog vremenskog trajanja putovanja s obzirom na brzinu broda između pojedinih međutočaka 
- Odabiranje proizvoljnih ruta 
- Uklanjanje i uređivanje ruta
- Pregled postojećih ruta
- Dodavanje i uklanjanje putnih točaka
- Praćenje pozicije korisnika na ruti (geolocation API) i usmjeravanje prema sljedećem waypointu
- Izračun vremena dolaska na temelju parametara početnog vremena i brzina broda između međutočaka
- aktivacija rute te usmjeravanje broda do najbliže točke prema putu


<b> Zaduženja Tin Pritišanac: </b>
- setup projekta
- odabir libraryja koji će se koristiti u projektu
- postavljanje funkcija za rad sa kartom
- kreacija routes pagea
- kreacija add-edit-route pagea
- selekcija i prikaz ruta na karti
- dodavanje, brisanje, editiranje i pretraga ruta
- lokalna pohrana u local storage za korisnike goste (Guest)
- tutorial za nove korisnike




<b>Zaduženja Neven Davidović: </b>
- login/register
- pohrana i slanje na bazu podataka
- dohvat podataka iz baze i učitavanje korisničkih podataka
- brisanje podataka iz baze
- page "Active route", "Register" , "Login" 
- Use Case Diagram
- Class Diagram
- prikaz pozicije na temelju geolokacije te automatsko i ručno osvježavanje geolokacije
- praćenje pozicije i usmjeravanje ka sljedećem waypointu 
- pull requests test
- responsive design
</br>
<h2>Kratki video prikaz praćenja rute broda uz aplikaciju navigate me:</h2></br>

https://github.com/AlphaActual/navigate-me/assets/57957655/d4a603db-b3f3-4357-a070-d9f700021827



</br><h2>Navigate me is mobile friendly</h2></br>
![263550879-f5b8929d-2013-4700-ac85-ae630e4f90f2](https://github.com/AlphaActual/navigate-me/assets/57957655/3f0f6331-59a8-4352-80aa-efac112fffc6)
![263550956-af51a866-4e2b-4bcc-8d44-0f464ab2fee1](https://github.com/AlphaActual/navigate-me/assets/57957655/b86f1a1c-2e32-4e39-bc6a-cf25e1027312)
![263550985-57d3bdfb-3309-480b-8a2e-a965c67c2f78](https://github.com/AlphaActual/navigate-me/assets/57957655/d7a4cfb5-2fc6-4fac-9108-072fc23811b1)
![263551022-4930ec39-b1c0-431a-9806-30d0d22797b1](https://github.com/AlphaActual/navigate-me/assets/57957655/17c08cdd-0083-487a-b76c-92e53f5b3979)



## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).
