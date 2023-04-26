## [1.5.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.5.0...v1.5.1) (2023-04-24)


### Bug Fixes

* **bundleName:** should not be exposed ([a393c08](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a393c08252b19d374eb267dce4089a9a977f2f69))
* **channel-addresses:** addresses should actually be associated to the company channel not the channel itself because then multiple companies will overwrite the same addresses for the same channels ([928d35a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/928d35ad2cb18ee5648d9416e986d1e552e758be))
* **company-channels:** auto-create addresses and join them ([438438a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/438438a2e778e0652566b761bdf786a389643769))
* **get-users:** do not filter external users at the auth service - no idea why that fixes the issue ([11ea890](https://bitbucket.org/bloodandtreasure/vendori-api/commits/11ea8900cb55d11cd75b59418ee54a3ed8ee43ea))
* **merge:** deployment issues ([532da43](https://bitbucket.org/bloodandtreasure/vendori-api/commits/532da4318b95aacc43337aca9aaf576c6b645cf0))
* **quote-products:** products are not being updated with the right quote when updating (still have an issue with delete) ([f072f18](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f072f189a7eef1b176872d5a35b9c55291965d6a))
* **users:** email uniqueness should be optional when updating ([6b56b51](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6b56b518e5be8f7398f991446f2eb5b4d3f91569))
* **VEN-1582:** fix starting quote and vendo numbers ([7f76016](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7f76016bf8d1de81e3beed04f0c6918f6fc35fc8))
* **VEN-2549:** show workflow pending quotes and vendos for admin ([cf5f3e8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cf5f3e80df3659a3a35e745c0b5edafc5d41fcbb))
* **VEN-2640:** fix bundle name ([7b37adc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7b37adc4bcd435968e8ab70c6d6c9eb2d1e6a39b))
* **VEN-2640:** fix replace one decorator ([a822511](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a822511496115ca228c13800d27de3046877b5cf))
* **VEN-2641:** fix bundle name ([5a87e3b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5a87e3bd52d88e0c3c6b1b224c46e436231c866a))


### Features

* **VEN-2649:** add global product hierarchy ([f79fdb4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f79fdb4b947eccf90836136bd5f4f02908ccdd89))



# [1.5.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.20...v1.5.0) (2023-04-22)


### Bug Fixes

* decrypt/encrypt with crypt by downgrade to 5 ([e2a3288](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e2a3288184f951660191e3723fab849c35d72973))
* disable some fields of quote product ([0273293](https://bitbucket.org/bloodandtreasure/vendori-api/commits/027329374aea1cedf4bf48eac5ff8008248424a9))
* **merge:** typo ([4ef76eb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4ef76eb6422d6c99b70be2b52cb9844fd46ab52d))
* **migrations::** update the migration for product_code ([b550f53](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b550f53754d01a467968f9ce9f0a9c06c0d5df0c))
* **migrations:** update billing freqenucy enumerations and product codes ([f1a8e46](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f1a8e46a71a0c42f5c957e4caddab74afa62f9a4))
* quote sync wrong id of event payload ([d45925a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d45925a663bcaa46e8a6aed76642220c001cfb0a))
* **recently-viewed-quotes:** select and join customer ([a3c15c0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a3c15c08bac4006276c6c842817b944898e9e6ee))
* **salesforce:** fix auto setting ownerUserId on create ([db91c99](https://bitbucket.org/bloodandtreasure/vendori-api/commits/db91c99e31c7e7d169a88a84127a5b63a0d5dda3))
* **salesforce:** minor issues ([acf5a4f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/acf5a4f9e4fabfc3176f6efd73c12cff58eafcee))
* **salesfore:** save customer ([fa823c6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fa823c611cdff59ceeb67b41eba77b6049abd794))
* **ts-config:** disable relative imports until finding the solution to make it work on jest ([6c23887](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6c238870b5226e46ccd03b28187ab8f1088d3b8a))
* **VEN-2449:** fix recently viewed quotes-vendos ([7a4ee51](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7a4ee514469a05e2850a791ff911581002500f9e))
* **VEN-2555:** fix eager updating ([a4dd893](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a4dd89305a343a14c1a8b0ea5b36c20dd9f6d333))
* **VEN-2575:** exclude unique columns on clone, add missing migration for sf_opportunity_product_id ([fab2273](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fab2273da9770b0c493700ad87aeb33dc0781591))
* **VEN-2625:** apply company.defaultQuoteExpiration when creating a new quote ([0eb43e8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0eb43e8ea64dfdac516324739f496c1f66609039))


### Features

* **2165:** sync products of quote ([5d5fd79](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d5fd794b9a5325358513662b191c9db557268c1))
* **2615:** recreating removed quotes ([95b70c0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/95b70c0d1909423a3d4a72134be0ee272617f526))
* **salesforce:** allow partners to be sent ([ebfccc3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ebfccc3c6d793489a34936c1eabc2636db066a50))
* **VEN-2167:** syncing products ([c040b10](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c040b10b73d9982f7872bb8abff711ee9a9b347d))
* **VEN-2171:** sync quote contacts in batch ([580e9ce](https://bitbucket.org/bloodandtreasure/vendori-api/commits/580e9cea20adc4adfc75c09a6f52194bee9ee0d4))
* **VEN-2380:** fetch salesforce contacts ([b3fd0f3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b3fd0f3709fbfdd0ea92b6aa74eca71f6d83b8c1))
* **VEN-2547:** add is global field. ([6ad058d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6ad058d5149f0376e92f250b38d8cefcdd97e8f6))
* **VEN-2555:** add test utils ([f16eb06](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f16eb067bc8a77860fe1e517e07c3707d2f763c0))
* **VEN-2626:** sync hierarchy ([a921c47](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a921c4791f7b7779bb2177a925fe7e4a0c17430b))
* **VEN-2632:** add global hierarchy ([8e16a6d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8e16a6d0ed836ec5be2b8b1b42ad0db67925f16d))



## [1.4.20](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.19...v1.4.20) (2023-04-18)


### Bug Fixes

* **channel-addresses:** add joins and fix addresses module ([86f82ad](https://bitbucket.org/bloodandtreasure/vendori-api/commits/86f82ad731c5009f39010d020df6e60a6fb5ebe2))
* **products:** creation doesn't work ([205907a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/205907a2e7c9b45da4fc9840207225ae31e5ccae))
* **salesforce-sso:** update redirect strategy ([0c327d8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0c327d840cfa58602ed1b121729925a0b0b41118))
* **salesforce:** auto-set the quote owner ([b656d39](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b656d39dc9a9e57694c1726c8e9d857b3b4959e5))
* **system:** wrapper issues ([0dad38c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0dad38cbfa6f0f1fbed705d3344e60fd1c3d57a7))
* **VEN-2574:** make product code optional in dto. ([ff74f43](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ff74f4305f1aa2685763331586cab9dc7f121883))
* **VEN-2606:** fix `organizationId` and ([dc1fff7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dc1fff7ac61bb2e388a1efc5cab326cd16b40b85))
* **VEN-2611:** implement delete discount priority. ([0c8742c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0c8742c142babf5920f730bcabe489c5602a0b3f))



## [1.4.19](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.18...v1.4.19) (2023-04-17)


### Bug Fixes

* **salesforce:** attempt to fix SSO ([882243b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/882243bb6c22cdf3b0dcc0f74221c65482b56d35))
* **salesforce:** missing import for SSO added ([8a917eb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8a917ebdbfc3e536517fccf9f263575574b24c43))
* **typo:** merge typo ([5340af7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5340af7f6ea4e58b5888c6cede2755451b01fae8))
* **VEN-2297:** rewrite retroactive priority. ([ef96f02](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ef96f023bb5c57cbeea8344dbe812eda71742cfc))
* **VEN-2574:** add product code migration. ([4fa2da1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4fa2da1a2e5ca0805734f965a0fe6d9fb30497d8))
* **VEN-2574:** add product code to products. ([46388a3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/46388a3b58acceabb9fc492d291d56c8afbfe171))


### Features

* **2170:** real time sync quote information(status, primary, owner) ([291ee4d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/291ee4daa959a7938f2497abf17283684faf8198))
* **VEN-2552:** implement channel address API. ([f48c830](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f48c83069eec2eed9050222260686507afe4b82b))
* **VEN-2560:** migration for billing frequency. ([e170107](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e17010706be77d75d57d13990e44b12ab064fa5d))



## [1.4.18](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.17...v1.4.18) (2023-04-14)


### Bug Fixes

* fix sync quote product ([cf71d19](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cf71d19256da01fabb39f7a9b92c808e9cac20d8))
* **salesforce:** metadata in quotes & owner user id ([a2ac071](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a2ac0715c368e4e565fe069ab8e1729f76240412))
* **salesforce:** missing changes restored ([3c96746](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3c9674634d3cc1ec09189964a71571c9c2683b37))
* **salesforce:** typo ([dd3b84f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dd3b84fae9ebcfd91338d1176d13a92253fbbaec))
* **salesforce:** unblock quote creation ([582e2f0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/582e2f0ae118dcd6bb5dcc148c84792200f18a9f))
* **VEN-2427:** fix delete QuoteCustomerProducts. ([46ce214](https://bitbucket.org/bloodandtreasure/vendori-api/commits/46ce214293e7a8ea7b26a56a0621655a4b1fba67))
* **VEN-2472:** fix error checker. ([550a10d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/550a10d462b0d74cfaa9c63bb8de5f458053adb5))
* **VEN-2472:** implement refresh token strategy. ([972046c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/972046c21350b9180c2ac17264393295e55dd7bf))


### Features

* **VEN-2374:** event emit decorator ([4bfe346](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4bfe34605430ed1d6f04ce93efb491d57c7ec13a))
* **VEN-2374:** separated cqrs service ([7d2ebde](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7d2ebde2cbcc1d3b60efe14e93ccb9c4a7e87231))
* **VEN-2384:** add list price to bundle. ([ff86afe](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ff86afee3430acd6bde6c82c42ed7773d4e1a2e2))
* **VEN-2540:** sync primary quote pricing data ([45bcff0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/45bcff05082fa71263274e15cfd1fe795ef66592))
* **VEN-2560:** update billing frequency. ([3389d69](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3389d693ab4b0e7f9a9d4558b898672eb2548705))
* **VEN-2560:** update demo products seed. ([7846b66](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7846b6622a2e013eb935c17c2007ef7261ab410e))
* **VEN-2602:** tune user first, last name ([35871e7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/35871e7bbc73fc24fd27b455ee61876cf440f0f9))



## [1.4.17](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.16...v1.4.17) (2023-04-11)


### Bug Fixes

* **consolidation:** env issues ([305377a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/305377a7b424fa61404a6aa4bd16e5a4547a8384))
* field mapping ([dc0d377](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dc0d377d624c77c47e41c51982f3df4ac7bb8e61))
* **initial:** initial API structure ([5955425](https://bitbucket.org/bloodandtreasure/vendori-api/commits/595542513538008003c22c6c2121470089466ea2))
* **is_primary:** auto update other quote primary fields ([eab6ce4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eab6ce455a9c6f733f1505b5ec03a312a583d95e))
* **login-v3:** fix seeds to test login v3 / consolidated envs ([5699c4a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5699c4abc213dac0c8085b5cc829b732c3777b45))
* **merge:** development was merged incorrectly ([f20b046](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f20b046aa2f14837176909dac488d5e9efa06c3a))
* **migrations:** only require name validation based on the company ([d0ceb38](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d0ceb38facf99cb21647c8885547911d9c6ade15))
* **product-bundles:** typo ([d8131c5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d8131c540943b7e47d7b38d10bde5d2a0bb6ff7c))
* remove condition for testing ([1d27da5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1d27da51f6f8bc244bbb8053c81a09bbf671b756))
* **rules-engine:** return dates ([dbf810d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dbf810d793889dcbfad1f9928b8658af9815c20b))
* **salesforce:** cleanup dtos ([ebbb079](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ebbb07911572a7908c1ddf8d33f473d5fa9361d2))
* **salesforce:** dto field in wrong model ([fe2e2b2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fe2e2b27ba3701529f31b9d6247ed628fd56dc68))
* **salesforce:** folder name format ([f95277b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f95277b08986d6dfd1ceff535a811b61e5d97aca))
* **salesforce:** migration fix ([a711ad4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a711ad45fad38053f3583202830180030dd737a8))
* **salesforce:** separate new columns into metadata ([a190cf5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a190cf5e011ad8af4b1e56c65f5057ad16a620a0))
* **salesforce:** the owner user id should replace exsisting quote owners ([85217f7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/85217f7408bb4a9b9c3b6f527fab51c757c7b844))
* **salesforce:** update user constructor ([0663706](https://bitbucket.org/bloodandtreasure/vendori-api/commits/06637060873c2e419672f9eaeb52e1ff4146a2bb))
* **typo:** typo ([c98f0a7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c98f0a7e1da38b15b280f0d15efc21738913f162))
* **typo:** typo ([a631318](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a6313186a9fe55ebfcbba1b348e128dd5635f0bb))
* **typo:** typo ([07103f8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/07103f82f47970cd36d3bec098680b59da98de5b))
* **VEN-2327:** show approved status in pdf instead ([2e68a70](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2e68a706ae54d25b2de2f1be15def60c9cd6ca1a))
* **VEN-2536:** check if value valid before using. ([e4e3d92](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e4e3d921b974abbee8336a31dd9ebec1e07838dc))
* **VEN-2561:** optimize PDF resize strategy. ([f02fb38](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f02fb388de272ad73d5cd5d6790c7a6def3627c5))
* **VEN-2561:** tune PDF resize strategy. ([eff9d7c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eff9d7c150e2125842cb0784cfb82327817b373a))


### Features

* **consolidation:** fix company find ([ab6ad83](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ab6ad834b02f5fbfe0bf211ff9b9d2882e492022))
* **salesforce:** add contract id to the dto ([9540eef](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9540eefd650a3da99b3d34243a0903c3f9aa2de4))
* **VEN-2293:** change pattern for roles reassign. ([395116d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/395116d780d91a6f89b396d6ffeb02b1bab31efa))
* **VEN-2293:** grant access only to admins. ([1d4950a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1d4950a84dff5472f647a8532c00081212ab0360))
* **VEN-2293:** remove disabled param. ([d56bba1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d56bba1b98e6bcc8a83238b6cd08fbaa9941003a))
* **VEN-2473:** sync quote products to salesforce ([149fb89](https://bitbucket.org/bloodandtreasure/vendori-api/commits/149fb893996dfd82c38a1b83d183704786c7f827))
* **VEN-2479:** syncing pricing data of quote products ([1943c44](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1943c44864eca1a94ef57ec5bc889fa13b29cd31))


### Reverts

* Revert "fix(product-bundles): typo" ([9624398](https://bitbucket.org/bloodandtreasure/vendori-api/commits/96243983d64e6142e48c9ac305803e0f191fb5c9))



## [1.4.16](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.15...v1.4.16) (2023-04-05)



## [1.4.14](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.13...v1.4.14) (2023-04-04)


### Bug Fixes

* correct setting the default value to null ([103ce01](https://bitbucket.org/bloodandtreasure/vendori-api/commits/103ce01c0c52193657f1ea3e0da82cf8711c5eb7))
* remove the wrong migration for custom_billing_frequency_settings ([9bdec4d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9bdec4da5b32fd91e3104c4001eb61b84b2e3e00))
* remove unnecessary log ([2b6b7ee](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2b6b7ee37e9218d5949b10c2b532a1938ced54c7))
* **rules-engine:** return dates ([ccae123](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ccae1233827ab4a1616bb1cc103e41debea09018))
* **rules-engine:** start and end date can be null ([d186536](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d1865361aad1bc5e1b33312b43159933d87049b7))
* **salesforce:** update the dto ([204411d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/204411d87c742217bfad256aa682a4e5eb11e2d3))
* **VEN-2382:** update option for batch job & refine ([7069484](https://bitbucket.org/bloodandtreasure/vendori-api/commits/70694846afcfdda9901f6ba122bb585b5572881d))
* **VEN-2519:** accept empty string as `websiteUrl` ([2bcb30b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2bcb30b24bedab505bb5204853d049c297e90e83))
* **website-url:** allow for an empty string ([a6e3857](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a6e38570844b6938b6ba2ec5062dd13c5ac0f0d0))
* **workflows:** remove end date parameter ([0386f08](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0386f08805ff42f74e2d8348629aae78efa6655b))


### Features

* **salesforce:** add sf_metadata to quotes ([f88e426](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f88e426af9bcf817afc4249dd08b665f5b80524a))
* **VEN-2293:** endpoint for bulk roles reassign. ([07daa34](https://bitbucket.org/bloodandtreasure/vendori-api/commits/07daa34ebcb88082711e5ded6f7dd1f2b2282363))
* **VEN-2383:** sync all quotes to quote objects in salesforce ([5b2064d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5b2064d19364c0068af1015937749504fe16f5f1))
* **VEN-2384:** add quote bundles to export pdf. ([ff629de](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ff629de274f0a2f59e550b9657d2b7860f004337))
* **VEN-2384:** update comments. ([5a659fc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5a659fc8087723e95f7fcf5d2957882f747d2c28))
* **VEN-2384:** update comments. ([533023c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/533023c2efbc1367173b8500962634602ca4cd12))
* **VEN-2459:** fix the date specification for all rule dtos ([5774d56](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5774d5612a2fc4c785a97a50f052246e29598db5))
* **VEN-2478:** add fiels to oem product entity for salesforce sync ([1ffc85e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1ffc85ecaac6c0cb008a26c53471178192e550d3))
* **VEN-2517:** remove unnecessary watermark dot. ([000af44](https://bitbucket.org/bloodandtreasure/vendori-api/commits/000af446fa99be789c3f9f467fedd9aa71d42078))



## [1.4.13](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.12...v1.4.13) (2023-03-31)


### Bug Fixes

* **fix-VEN-2040:** add is empty util ([6cc8784](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6cc8784b5388df219a9d39015dbb0ae253c60922))
* **fix-VEN-2040:** add is empty util ([cf38008](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cf38008e9a84a55bdf716f5388071dd96d28b45e))
* **fix-VEN-2040:** remove checking product/bundle types ([4a90fa4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4a90fa4f15189dc4870ef16c9ec3ceee93b46cba))
* **salesforce:** do not require the primary attribute on quotes ([edf17fc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/edf17fc775433922d219f99218d2f3b23b9b9b24))
* **VEN-2040:** handle empty products bundle ([ea0baca](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ea0baca629bdb73946e986e253368ae7f93de008))
* **VEN-2297:** fix order of discount elements ([b6ad4c1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b6ad4c120e915f445f49a56bafb35f0afc1a0324))


### Features

* **workflows:** add start and end dates ([98e322f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/98e322f29a7a0e5ae92d07ea3cb35466c51f417f))



## [1.4.12](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.11...v1.4.12) (2023-03-31)


### Bug Fixes

* **product-bundles:** unit tier is now joined properly ([8107803](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8107803ec8ed3cb20693ec3bc8edcbfc0669c3f3))
* **product-transition:** add source/target bundles ([3eeed97](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3eeed97dbd31475d3ec4937b4ea39f0be3d8c43c))
* **VEN-1899:** red draft status and watermark. ([33b6b36](https://bitbucket.org/bloodandtreasure/vendori-api/commits/33b6b3619d983a10b327896e9f63bc7cf5353967))
* **VEN-2132:** fix documentation for pdf merge ([9654cc0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9654cc0004b3a4d8aa4339213d3f534e56ebe928))
* **VEN-2132:** pass quote PDF position to merger. ([e48162b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e48162bacbd10dbf458b7a3121b8b1c8c3bc3ba3))
* **VEN-2132:** pass vendo PDF position to merger. ([c976172](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c9761728d4284d5a4f37da0760981c693fad5994))
* **VEN-2132:** sizing for supporting materials. ([d48c4b4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d48c4b463fc0618b6f062b9644c25bbe5d6d2f52))
* **VEN-2297:** use crud request interceptors for ([6f4c400](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6f4c400cc2a60f92d39d08311965ec9271d22625))


### Features

* **VEN-2382:** Write Queue Module For Quote Batch Sync ([e73c94b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e73c94b82d7c5553923b3e2eb8366d62e2e8b5ef))
* **VEN-2415:** Sync Quote OwnerShip ([70e2c1b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/70e2c1bed31f311bc7b391e8ceef21c0c7d895a0))
* **VEN-2462:** add fields to quote entity for syncing ([606ff9f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/606ff9fceaff4847da47bb80e67bb81fc5f54268))



## [1.4.11](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.10...v1.4.11) (2023-03-30)


### Bug Fixes

* **migration:** add a missing migration for locked fields ([6cf7855](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6cf78555dda34ac298af5fd73d9b25232da9a479))
* **VEN-2030:** fix product transitions joins ([8bf6a03](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8bf6a034c3383f6640daca5155d6db792738c5bf))
* **VEN-2460:** add engine definition to package. ([be5905b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/be5905b834af58f2b428d3a0d3493534add89dcd))
* **VEN-2460:** fix npm engine version. ([3c52190](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3c521902586751a991f2ba47749c105d2e7385aa))



## [1.4.10](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.9...v1.4.10) (2023-03-28)


### Bug Fixes

* **migration:** product_1 does not exist ([b31d443](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b31d443f04ec5c75de5bf086ae2113cfbe76db1e))


### Features

* **VEN-2409:** add `lockedFields` field to quote. ([fc8b79f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fc8b79fe5ef3694bf18f539104fd06871376eef6))
* **VEN-2410:** Add settings jsonb field to oem_salesforce_integrations Entity ([79111ef](https://bitbucket.org/bloodandtreasure/vendori-api/commits/79111ef378588be9c701a79a7381eeaa178ca2bf))



## [1.4.9](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.8...v1.4.9) (2023-03-25)


### Bug Fixes

* **bundleDto:** fix bundleSettings ([13012d4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/13012d40308d79dfed5a311e014cd9facb4d5621))
* **env-update:** fix migrations ([fc536e1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fc536e1823b3b6827c66a79c751b7e759d64f556))
* **env:** add uniqueness based on the company within the same schema ([67375ff](https://bitbucket.org/bloodandtreasure/vendori-api/commits/67375ff107d86be469b00471c6996abdadeffb86))
* **FixUpdateReplceOne,Clone:** fix crud nestjs update, fix clone bundle ([40d5640](https://bitbucket.org/bloodandtreasure/vendori-api/commits/40d56402c8089d7f122a2f770963a79fd0b95741))
* **hotfix:** fix the migrations ([3373dcb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3373dcb035b6b997ae4c07f4299117dbec21f756))
* **hotfix:** fix the replace decorator ([357816e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/357816ef0ff945846e623f09d11d17be8b8fe2d1))
* **logger:** change to static ([ed62a48](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ed62a48f1d61ad1497ab47ff9ab637b46d96bbcb))
* **pricing_model:** add pricing model migration ([e9bade3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e9bade3a2676209dcfa2848aceb80f5405dd5562))
* **salesforce:** allow joining customer addresses ([d51b652](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d51b65214c88cc4a5a07d357ebce61226379dfa1))
* **seeds:** make the company dynamic for multiple clients ([6eb233a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6eb233a46ca6713b4c78d8d99a6fc6cb57783766))
* **setup:** fix ClassSerializerInterceptor ([73e36db](https://bitbucket.org/bloodandtreasure/vendori-api/commits/73e36dbbaecd6cd25c4682e0537edc832fd55a2c))
* **VEN-2040:** fix circulation dependancy issue ([a09aa5a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a09aa5a486799f0d2f7a461be60eeb7a766d6e46))
* **VEN-2040:** fix migration ([5d6f87c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d6f87cb10527cbc0e0e35f15ecad728d1ec13fb))
* **VEN-2273, VEN-2236, bundleDto:** fix salesforce, update bundle dto ([4f35a37](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4f35a373a64daa64afdf43eefa1cf88dbad03f1b))


### Features

* **VEN-1775:** add website to company ([2b25150](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2b251500c038456ffd5298d6d5bcb1880ce95c6f))
* **VEN-1776:** add websiteUrl to company ([b3bc07e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b3bc07e14bdcc2fef13f0143843e34fbca6708de))
* **VEN-2040:** add bundle customers quote ([3421ed2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3421ed2ee55847d733ace2ad4d7b9832c96a4ac3))
* **VEN-2040:** add bundles ([26afe6e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/26afe6e1d1d4163ad2803d1fbfdd6e033a73f365))
* **VEN-2040:** add migration ([b32e0d8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b32e0d8e92b7ec3c98963a0bea4ca9004491fe39))
* **VEN-2131:** add salesforce login ([9160d36](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9160d365bd06d7a416d6c91168c57102aa7ccac6))
* **VEN-2131:** add salesforce redirect ([780b82e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/780b82ee529c1cfb11494c833f74ae6ee8ba003b))
* **VEN-2320:** add crud framework supports for custom method ([a42cee9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a42cee98c262d820dd2e9a333402c7e2bf6630a9))



## [1.4.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.7...v1.4.8) (2023-03-06)


### Features

* **VEN-2040:** add bubdles ([4c60ce4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4c60ce4c5c6fe12f61c7f8b906ee1c0752ba04a7))
* **VEN-2152:** add migration ([41bde6f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/41bde6fd14980f82df756abb64ddf3450486c89b))
* **VEN-2152:** add sales-force-integration module ([da104a9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/da104a9c6e16cac255d0f2acfb0c10dd1258d764))



## [1.4.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.6...v1.4.7) (2023-03-03)


### Bug Fixes

* **migration:** add migration ([45f2e9d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/45f2e9d4d97bdbbbfa94ea628f98d1db382caede))
* **VEN-2055:** add validation fix ([393ef95](https://bitbucket.org/bloodandtreasure/vendori-api/commits/393ef95d3ae1292e0e2e61c69e49a355edeac157))


### Features

* **VEN-2029, VEN-2191:** add custom-billing-frequency-settings, add delete controller for unit-tiers, price-tiers ([5294191](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5294191342e4b351f6f8c0609d0f720dcd3dc890))



## [1.4.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.5...v1.4.6) (2023-02-24)


### Bug Fixes

* **applyMixins:** fix applying mixins ([e4df836](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e4df836146cb5cb4898d4f0be2450552a5d83ea7))


### Features

* **VEN-1747:** add default comment ([9ff8961](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9ff89613f0d866edc7e63515b7d6d2fe09314557))
* **VEN-2056:** add accounts from all companies ([f004d07](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f004d0795009b6e123eec3166d56556b4718e6ca))



## [1.4.5](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.4...v1.4.5) (2023-02-23)


### Bug Fixes

* **pin-code:** missing migration ([317c918](https://bitbucket.org/bloodandtreasure/vendori-api/commits/317c9183a1589c3bae2fee87edef4ea828b7d52b))


### Features

* **VEN-2027:** add bulk delete and bulk copy ([ed0b1ac](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ed0b1acaa94be6000339968c808c4c35569428fe))



## [1.4.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.3...v1.4.4) (2023-02-21)


### Bug Fixes

* **google-login:** when redirecting upon failure, use the ENv to determine the redirect URL ([055f42c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/055f42c2168e41d7964a449d6f402269e17618e1))
* **logo-url:** when exporting do not require the customer logo ([008cf4e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/008cf4ebe4b1678755133c8f7423f82102158faa))
* **seeds:** fix workflow user assignee ([ed2623b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ed2623babfd924ccd92e04c40101476fec849d63))
* **VEN-1618:** route catch-all rule to the admin by default ([90d4736](https://bitbucket.org/bloodandtreasure/vendori-api/commits/90d47362bd1673b87c03ee77747a987e6fccb155))


### Features

* **VEN-1779, VEN-2037:** add pin confirmation, fix vendo uuid dto ([767e7e9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/767e7e93cc0f17155c24b109a464953da179d04b))



## [1.4.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.4.2...v1.4.3) (2023-02-20)


### Bug Fixes

* **client-demo:** minor fixes ([5d1927c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d1927c54247c9ce9fbce9293b142a578482d4fc))
* **linter:** auto-fix all errors ([006b5e8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/006b5e80fa67eb802936c885b830f728c9d5cdce))
* **linter:** fix lint issues on save per file ([a77348f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a77348ff94e9906b05463720093f0e181e097abb))
* **seeds:** reset keys after backing up ([6f15f6f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6f15f6fb33eac6441be3e105e7cc5e0d1b6ac2d4))
* **swagger:** fix swagger slowing ([2e1153d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2e1153d41241a225f0a71565e248e84ef7622c2e))
* **urls:** increase the limit for URLs ([36ad3ee](https://bitbucket.org/bloodandtreasure/vendori-api/commits/36ad3ee3d65858a588a9fc7808bf93c91e395454))
* **VEN-1698:** resolve path for resetDBMeta ([023789e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/023789e24afa3f830f50a6731a3933990d2c5be6))
* **VEN-1699:** fix userId issue on demo seeds, fix tests ([8b0fae5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8b0fae5113bc699419ab60305fe69b5285932b1d))
* **VEN-1699:** run seeders with query builder instead of factory to override auto increment primary keys ([f4d726c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f4d726c9496d63a0cafda6e2267f3307af78725c))
* **VEN-1850:** fix isEnabled quoteProducts for pdf ([b0dc9f6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b0dc9f60c3da229e61bd80b645e632f2d1fb58ba))
* **VEN-1972:** fix quote-users ([02b47c9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/02b47c91e42aaea073dd0e2390f73ff8b90f0c1f))
* **VEN-2015:** add roles-visible-product-field migration ([396be2a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/396be2a19e3412e9b12279c45e2d0524d2955c82))


### Features

* **CD-1699:** company, addresses, company addresses for demo seeds ([8d05cf4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8d05cf454b3fac62d83438834ff5aff931db7c5a))
* **VEN-1698:** implement clean env seeds ([59a0008](https://bitbucket.org/bloodandtreasure/vendori-api/commits/59a0008ac7c846eba98dc819d538f706526acfc9))
* **VEN-1699:** demo seeds for customers, customer addresses, customer products, quotes, quote-and-vendo-uuids, quote users, quote approval queues, contacts, quote contacts, quote customer products, quote materials, quote products ([93b9027](https://bitbucket.org/bloodandtreasure/vendori-api/commits/93b9027399d118e1e945641b92c9b98bbae01753))
* **VEN-1699:** demo seeds for geoHierarchies, roles, users, channels, companyPrograms, licensingPrograms, companyChannelSettings, companyChannels, workflowRules, visibleProductFields ([86e9dfc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/86e9dfc144114cbeca0665ef151e2f6250456a3c))
* **VEN-1699:** demo seeds for materials, discountRules, discounts, pricingModels, unitTiers, products, priceTiers, shadingRules, approvalQueuePriorities ([5febe4a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5febe4abd5b00cb53c9f689f204f8331dd706af4))
* **VEN-1932:** add redirect filter ([cd1b9e7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cd1b9e7bda5a3a234e1da6fb90f8fe5c27d36c76))
* **VEN-2015:** add visible product fields bulk ([d761a8d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d761a8d47ed32b011a6beccd46a8937d9b8e8fa3))



## [1.4.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.25...v1.4.2) (2023-02-12)


### Bug Fixes

* **company-channel, VEN-1538:** remove uniqness, add quote-expiration ([0423f8f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0423f8f04c335e8d50293ba7435dfdf1d9003958))
* **migrations:** logoURL size & dropping constraints ([4e63a2a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4e63a2ad40e41059b7ec3c199784dd589827b7e8))
* **VEN-1949:** prevent decreasing the last uuid ([e4e5c40](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e4e5c4091a5e27955a268ce98e85375be3aaa776))
* **visible-product:** fix deleted one ([58e5e7d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/58e5e7df60e32deb838cce6b86fba45a526cf59d))


### Features

* **VEN-1945:** clone discounts ([6b85008](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6b85008d73d659f65ffe8523f828e0a453d7e675))
* **VEN-1945:** clone shading rules ([9785117](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9785117b42da4295187acdb206c61d560b7d21ae))



## [1.2.25](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.23...v1.2.25) (2023-02-10)


### Bug Fixes

* **VEN-1811, VEN-1750:** fix replaceOne, fix approving quote ([35f2e28](https://bitbucket.org/bloodandtreasure/vendori-api/commits/35f2e284d43eba20b2e742a4da7a910c9b09e49a))
* **VEN-1811:** fix external approving ([b051fd5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b051fd5ab312b794099475305fc5216e9a7e4bd4))
* **VEN-1927:** correct the name for a cloned saved alert rule ([914b144](https://bitbucket.org/bloodandtreasure/vendori-api/commits/914b144937c0fb361091f1dec0dca38670e7df91))
* **VEN-1930:** correct the modelName for a cloned pricing model ([91af688](https://bitbucket.org/bloodandtreasure/vendori-api/commits/91af688a5875c3c36fd83ef8524a34bfba7d77ee))
* **VEN-1931:** copy unit tiers when cloning pricing models ([4a7837a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4a7837aff0833c336cc69ba884ef5565ad89d6b8))


### Features

* **VEN-1777:** add quote start number ([1d69627](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1d69627ab5268bd0b12d64a326e53f1d39c4cee3))



## [1.2.23](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.22...v1.2.23) (2023-02-07)


### Bug Fixes

* **VEN-1814:** fix company_id ([4a31613](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4a316138d19264bda6973caad081a2a672c7721d))


### Features

* **VEN-1685, VEN-1887:** add external-user ([7cb160d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7cb160d8fe558cdb30a6f029ad5a99171f82424a))
* **VEN-1814:** add company channel setting ([6e71870](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6e71870bf8f102639d6680182095fed4500966cb))
* **VEN-1814:** add migration ([3e503b7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3e503b7e705b3620200b80cf6459753968f50a7c))
* **VEN-1892:** add both channel type ([73dba76](https://bitbucket.org/bloodandtreasure/vendori-api/commits/73dba7664dbec79938a0ba423fc4c329bc76b8e8))



## [1.2.22](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.21...v1.2.22) (2023-02-07)


### Bug Fixes

* **deployments:** add visible fields for the clean demo env ([628264e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/628264e6ad44d07f6156d2d7a15bfa4465d79369))


### Features

* **VEN-1620:** add the general decorator to clone quotes or vendos ([2102f0a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2102f0a6098e8940df1c81337ff32d7e2284adb0))
* **VEN-1620:** implement the general decorator for product relationships, products, pricing models, discount rules, saved alert rules, vacation rules, workflow rules ([5cfa07b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5cfa07beffb603b2f9df548c4ae8c4f521d2feec))



## [1.2.21](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.19...v1.2.21) (2023-02-02)


### Bug Fixes

* **deployment:** email issues ([642ac31](https://bitbucket.org/bloodandtreasure/vendori-api/commits/642ac31fd18b8dde82589803adb23c02f076be86))
* **deployment:** email issues ([a0c2d50](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a0c2d503f649e1256e257d1fe1da841d0a1e011f))
* **deployment:** minor issues with approval ([63a539b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/63a539b3540d91c70d3caca9206805ceb1a9a2a3))
* **deployments:** typo ([9374f90](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9374f9087598d46299065c7f099f21fc8bef1f28))
* **logins:** wrong path ([770b936](https://bitbucket.org/bloodandtreasure/vendori-api/commits/770b9364b028a08faa308e8c13471e394d4b7aa9))
* **VEN-1556:** admin can approve all steps by once, add jwt externally ([de574fa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/de574fa2a58c40c33def13731b00a87e71424df6))
* **VEN-1559:** grant permissions to the current db user after resetting the database ([300ff30](https://bitbucket.org/bloodandtreasure/vendori-api/commits/300ff304cbe467a0b39b77fc52617c418c6c6e33))
* **VEN-1651:** add ctaText ([846a167](https://bitbucket.org/bloodandtreasure/vendori-api/commits/846a167b3cb52e7d7b1364a7fd70b22d118bdfdc))
* **VEN-1651:** add frontend url ([5d5ad2e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d5ad2e1675144ba1ec2fcb2e65a8f190c06018d))
* **VEN-1800, VEN-1811:** fix internal and external approving ([275da9b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/275da9b9221cbd66c3af6816ee0d3a9b02552efb))
* **VEN-1809:** quote DB_NAME for case insensitive search of the database name on reset ([c5ffdcb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c5ffdcb075328cf3e6e5c22327c74cd60e2775d0))


### Features

* **VEN-1650, VEN-1651:** add google and email login ([5d32781](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d327817c0f6dea84159b5f8600b01e1aee0391a))
* **VEN-1650:** update env ([1180549](https://bitbucket.org/bloodandtreasure/vendori-api/commits/11805491f270de3a1bf4bc7d6d13abfcaf5bf0a9))
* **VEN-1658:** account for quote.dealType on the pdf generation ([e88ae8c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e88ae8cc01eb52ff875f90d10952879320859e87))
* **VEN-1666:** customize the pdf background color based on company settings ([c13be38](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c13be3832ddd6879455762ff780e59ff8681520c))
* **VEN-1697:** API - Swagger API Docs - Add basic auth ([a4f6b1f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a4f6b1fd0c0ac2ddcbba9e5c04510ffed3296aa1))
* **VEN-1797:** expose getMany, getOne endpoints for quote-and-vendo-uuids, validate lastUuid on PUT, update tests ([086fbdd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/086fbddd6ced6b20ad4319197840a2425db75be3))
* **VEN-1797:** set the default quote expiration to 1 ([4afd24c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4afd24c3691c0e05e8dcca2632c36b15cf0702f9))



## [1.2.19](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.3.1...v1.2.19) (2023-01-20)


### Bug Fixes

* quote db username for migrations and test util ([6577aa8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6577aa84dca507f97103299392cd5992d1bb7452))
* **VEN-1618:** create Catchall rule on reset for clean env ([1b08005](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1b08005591bb4dcf81902f45ab3bd6ad499c12d7))
* **VEN-1669:** do not lock quote/vendo on Auto-Approved ([2c34a96](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2c34a96c00113a842a16cf4bfa3c61fd8dcd3c38))



## [1.2.18](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.3.1...v1.2.18) (2023-01-20)


### Bug Fixes

* quote db username for migrations and test util ([6577aa8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6577aa84dca507f97103299392cd5992d1bb7452))
* **VEN-1618:** create Catchall rule on reset for clean env ([1b08005](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1b08005591bb4dcf81902f45ab3bd6ad499c12d7))
* **VEN-1669:** do not lock quote/vendo on Auto-Approved ([2c34a96](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2c34a96c00113a842a16cf4bfa3c61fd8dcd3c38))



## [1.3.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.18...v1.3.1) (2023-01-13)


### Bug Fixes

* **company-channels:** update the primary id key ([5f28fa1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5f28fa19068c0d1977412d8101330383b6fd6e14))
* **VEN-1623:** fix the error message for role name validator ([919ddd6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/919ddd6c881be732266040297287b6a611b970a9))



## [1.2.18](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.16...v1.2.18) (2023-01-12)


### Bug Fixes

* **action_logs:** fix user join in subject ([5a90c11](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5a90c111638348477459ac8ebfa225e59633fc9d))
* **action-logs:** remove index on action log association ([e30b65c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e30b65c2deb4d176a29fe3ac73ee6ecc58d27cca))
* **VEN-1623:** case insensitive check for role name uniqueness ([90f85d8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/90f85d84293d277e5a86b28bd15546bf4f353c92))



## [1.2.16](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.15...v1.2.16) (2023-01-10)


### Bug Fixes

* **VEN-1443:** add seeder for visible product fields, fix tests for reset env ([865e820](https://bitbucket.org/bloodandtreasure/vendori-api/commits/865e8202a7e6074d399b78cd2731893a9b46ae86))



## [1.2.15](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.14...v1.2.15) (2023-01-09)


### Bug Fixes

* **VEN-1274:** add the bottom margin to charts ([cda0f28](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cda0f28de66000718ed30881a38f9675c96f91fa))


### Features

* **VEN-1603, VEN-1632, VEN-1633:** add additional action-logs ([60136ec](https://bitbucket.org/bloodandtreasure/vendori-api/commits/60136ec28949464ef0bd763373da593cb9e6f470))
* **VEN-1603:** add material action logs ([32ff95a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/32ff95a872908c8d5e73870fb698885be4f0622b))



## [1.2.14](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.13...v1.2.14) (2023-01-08)


### Bug Fixes

* **VEN-1542:** exclude relations when deactivating targets with multiple primary keys ([8465233](https://bitbucket.org/bloodandtreasure/vendori-api/commits/84652334096beeb3f03041b8f8d0bf1688751f3a))
* **VEN-1623:** validate the role name existence when creating a new role ([af9f7c7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/af9f7c73346c4da65661ef3da2e88a3e3500c430))
* **VEN-1631:** disable other approvers when creating a vendo approver ([0d45197](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0d4519786bf13d8e9c19141a2b6467dc6ac102e6))



## [1.2.13](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.12...v1.2.13) (2023-01-06)


### Bug Fixes

* **action-logs:** fix workflow action logs, fix attach type logs; ([265d8cb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/265d8cb07bc519d36e1b7306dcb54ff516b79a6b))


### Features

* **VEN-1635:** support role, company joins for vendo user ([c11834e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c11834e8ba8037d7759d0c9d660ba5cb675e717c))



## [1.2.12](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.11...v1.2.12) (2023-01-05)


### Features

* **VEN-1626:** add nested join for multiple fields ([e3a9ca4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e3a9ca48c1c81e923fd6b92caa7d4c6e273988c9))



## [1.2.11](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.10...v1.2.11) (2023-01-04)


### Bug Fixes

* **VEN-1475:** correct the logic to mark recently viewed quotes and vendos ([294e706](https://bitbucket.org/bloodandtreasure/vendori-api/commits/294e706bcf0965514abb0e8dad68ca4d38db62ea))



## [1.2.10](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.9...v1.2.10) (2023-01-03)


### Bug Fixes

* **migrations:** update enum update ([ff7fccc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ff7fccc4a84691d963278d3f6eb665d27295a1a7))


### Features

* **VEN-1590:** add nested filter ([9eab557](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9eab557d02c309f2815459d3f705f91e5acabb8b))



## [1.2.9](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.8-b...v1.2.9) (2022-12-22)


### Bug Fixes

* **actionlogs:** add action log repo provider ([b770fc8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b770fc8437cbd6df41824812a18ddfd877997ebc))
* **deployment:** typo, + removed migrations ([df2d5be](https://bitbucket.org/bloodandtreasure/vendori-api/commits/df2d5befd1daee8caddc3d10609b18520cf0c2b5))
* **VEN-1274:** automatic page break for quote products chart ([70ec56d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/70ec56d7b3496885d2aa3b4e063db7cdb34653f2))
* **VEN-1475:** fix ordering recently viewed quotes and vendos ([f387bea](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f387beab04d7bf1f201b1cb0180b64d774323735))


### Features

* **VEN-1472,VEN-1591,VEN-1592:** add ([786f7b5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/786f7b5bbe7b34a8a06ad9113fc531e0d79f13da))



## [1.2.8-b](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.8...v1.2.8-b) (2022-12-21)


### Bug Fixes

* **VEN-1423:** validate the priority only for enabled roles ([a46214a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a46214adc6e88c8e68e4c8496ace513bfd8b3f09))



## [1.2.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.7...v1.2.8) (2022-12-21)


### Bug Fixes

* **VEN-1274:** resolve fonts for pdf exporter, fix auto page break for quote products chart ([573500e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/573500eface50dec8e7118f405905a316a03ef7c))


### Features

* **VEN-1476:** fix validation issue ([df81baf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/df81baf420326b43ae6dc9bb3fee92f7b3933ba8))



## [1.2.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.6...v1.2.7) (2022-12-15)


### Bug Fixes

* **1477:** fix copy uuids ([4047359](https://bitbucket.org/bloodandtreasure/vendori-api/commits/404735937f366c63a5671718c482e5c5f149b87c))
* **name:** fix automatically replacement ([f3ca063](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f3ca063c92f6062f4283a48bac9978b6acd6fd65))
* **VEN-1470:** fix primaryKeys copies ([fa7eb43](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fa7eb4384c03e63cb0eca8ce6ffb9b87ffe6c447))
* **VEN-1475:** sort recently viewed quotes and vendos by updated date ([de16363](https://bitbucket.org/bloodandtreasure/vendori-api/commits/de163630a397f85c2e2ce0043f3c80a59defd10a))


### Features

* **VEN-1420:** add join for action logs, improve folder structure ([bff7ce2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bff7ce285162a2e6b9a07477115f84cff5cf3c67))



## [1.2.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.5...v1.2.6) (2022-12-12)


### Bug Fixes

* **quote-users:** fix setting eApprover ([117c6be](https://bitbucket.org/bloodandtreasure/vendori-api/commits/117c6bea79c8a8c471e5537f55db58e05695ec7c))
* **VEN-1475:** make customer join optional ([50aa7ae](https://bitbucket.org/bloodandtreasure/vendori-api/commits/50aa7aeeaa3f6578b8180c65d1204febdfe57a6a))


### Features

* **VEN-1076:** group product transitions by source product ([c69dbee](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c69dbeeabaea9ae24cf34144b9ebb58b2a935335))
* **VEN-1274:** resolve the truncated labels based on start/end dates ([4b683ba](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4b683ba86601dfa63c4da9ab8a645940f5ab0110))
* **VEN-1474:** add a join parameters ([195b10d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/195b10dda56f42000bdf5d1f4fd6e7733ba107e4))



## [1.2.5](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.4...v1.2.5) (2022-12-05)


### Bug Fixes

* **deployment:** missing migration & disable bull admin ([81ae29e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/81ae29ec6b2e443bfe3287387c7b6cab4e270953))


### Features

* **VEN-1415:** add general deleteOne decorator ([13963e6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/13963e68bd4152fdef63fc939e9088951f99d418))



## [1.2.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.3...v1.2.4) (2022-12-01)


### Bug Fixes

* **deployment:** merge issues ([9a67e4e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9a67e4eeb8c6797c428be397b6626d74e354e530))
* **VEN-1417:** save the salesforce token issued_at correctly ([9637951](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9637951c7a23ebeb7e841fd71bbf110233bc2cd0))
* **VEN-1417:** store salesforce token on the database to prevent REQUEST_LIMIT_EXCEEDED error ([b867590](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b8675903b8ae4379608d1b05001014c42108e0b8))


### Features

* **VEN-1417:** add validation for salesforce opportunity ID ([713776f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/713776f66d17341abed12216a2648d6058cbcb2a))



## [1.2.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.2...v1.2.3) (2022-11-29)


### Bug Fixes

* **VEN-1032:** fix action logs create ([c42463a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c42463a23ce123bcc5e24bb033b09ffac6c9f229))
* **VEN-1032:** uncoment action logs product relationships delete ([4f23d1f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4f23d1f5241220a9109c57e544ad2d945b108974))


### Features

* **VEN-1032:** add action logs, cover by tests ([a2de0a6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a2de0a66b27636a77aad74d805d8e8db4d19be00))
* **VEN-888, VEN-1144:** add expired logs, support background logs ([f348698](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f3486985f8bd5ff26ed4ccf1dcf8f8fbad4239b9))



## [1.2.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.1...v1.2.2) (2022-11-24)


### Bug Fixes

* **VEN-1358:** hide quote contacts, invoice schedules, unit economics on demand ([63d737d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/63d737d92b5f10982c0d771c12803e2c72fbd297))
* **VEN-1365:** disable a quote on delete ([011545e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/011545ecb25d795be89a2d41b1be11b7eb0442b8))
* **VEN-1398:** sort vendo quotes by createdAt to keep the order added by the user ([707d050](https://bitbucket.org/bloodandtreasure/vendori-api/commits/707d050548b6a566a30ab81b2870f288266435d8))
* **VEN-1415:** disable vendo instead of deleting ([172b039](https://bitbucket.org/bloodandtreasure/vendori-api/commits/172b039472613292fcf249c6f0d880767e003751))



## [1.2.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.2.0...v1.2.1) (2022-11-22)


### Bug Fixes

* **emails:** fix email attempt [#1](https://bitbucket.org/bloodandtreasure/vendori-api/issues/1) ([d9ff542](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d9ff5426a34ff4f3664bda3a33e1332c21bb8968))
* **emails:** fix email attempt [#2](https://bitbucket.org/bloodandtreasure/vendori-api/issues/2) (success) ([4228f6f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4228f6f93deba3eb2a9777a71290fb4c8806f04c))
* **post-deployment:** post deployment issues [#1](https://bitbucket.org/bloodandtreasure/vendori-api/issues/1) - clean demo issues ([e260080](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e26008020d7d3c5962bc99092a7d06dc1bd50c24))
* **seeds:** do not seed hierarchy nodes on the clean demo Index ([594c096](https://bitbucket.org/bloodandtreasure/vendori-api/commits/594c0965e2e0b194f348f8c2a29a8da66a226b2e))
* **seeds:** remove duplicate users ([e5f224c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e5f224c5b69489f53c1e9f353adaa86bc923a866))
* **seeds:** the admin approval queue priority should always be last ([2d6721b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2d6721b20f43c773d361c86de7fa6948b7bd3787))
* **VEN-1348:** fix the subject within the dynamic template data ([15d75b6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/15d75b6c3c805175076fcc1c8f388317c8ac41f1))
* **VEN-1409:** Do not create internal quote approval queue entries when submitting externally ([790e4cb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/790e4cb18b022685414a64488eef9832899cebfc))


### Features

* **VEN-1397:** Quote has the pending internal approval status after approval of the entire chain ([a0af43c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a0af43c2a20c23917124b77e034c0e174ec8920f))



# [1.2.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.11...v1.2.0) (2022-11-21)


### Bug Fixes

* **VEN-1398:** sort quote products by quoteProductId when exporting quote/vendo pdfs ([3302c4b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3302c4b9bc9045e2475be843c0f22f3a43d673e9))



## [1.0.11](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.10...v1.0.11) (2022-11-21)


### Bug Fixes

* **VEN-1395:** Permissions/ Roles: Change quote/vendo create rights ([8e17ca9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8e17ca90cf1950d09b2329288cbe7e832f512979))
* **VEN-1396:** Quote does not appear in the Approval Queue for the admin if he is specified in the Catchall rule ([948c267](https://bitbucket.org/bloodandtreasure/vendori-api/commits/948c26759384794e32d97aa7d8d7ae569cec1636))
* **VEN-1398:** sort vendoQuotes by quoteId and quoteProducts by productId when exporting quotes or vendos ([e262bd9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e262bd9efff73610a831c5c70e63b5fe4b0b5c46))



## [1.0.10](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.9...v1.0.10) (2022-11-18)


### Bug Fixes

* **VEN-1348:** Email Template: Fix overlapping text issue ([d8e4a50](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d8e4a50dd96b2f7037425edec5b7cfb3ea29ee66))
* **VEN-1366:** Catchall Rule: Error when trying to approve a quote if Admin is specified in the Catchall rule ([47cbb5a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/47cbb5ac8aa0fd932bb011aa7b6ea1425e4f28d1))



## [1.0.9](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.8...v1.0.9) (2022-11-17)


### Bug Fixes

* **VEN-1348:** Email Template: Fix overlapping text issue ([912d918](https://bitbucket.org/bloodandtreasure/vendori-api/commits/912d918e91e5689984c0a64f94054901e84739d3))
* **VEN-1350:** set expiration with company's default quote expiration when cloning a quote ([27c3e49](https://bitbucket.org/bloodandtreasure/vendori-api/commits/27c3e496c6fb08bd931e12fe01e7909077bd194a))



## [1.0.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.7...v1.0.8) (2022-11-17)


### Bug Fixes

* **VEN-1350:** nullify quoteName and opportunityId, reset expiresAt on clone ([bf47754](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bf47754fa7a4665f78ee3d4738deaa756d580b8f))



## [1.0.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.6...v1.0.7) (2022-11-14)


### Bug Fixes

* **VEN-1250:** Seed data for external user is wrong ([d9d9c61](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d9d9c616caa4da63c49241e3f999cf4ca2239410))
* **VEN-1338:** Can't send a Vendo for external approval ([d20d636](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d20d636f8ac79646399b5b93828ce854f94604e1))



## [1.0.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.5...v1.0.6) (2022-11-11)


### Bug Fixes

* **VEN-1189:** fix loading quotes and vendos for assigned-only data access ([2661c29](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2661c297d123d4b785f17561bc494a6f50790903))
* **VEN-1267:** fix setting vendo_uuid on clone ([5c9b0c3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5c9b0c3dc8bb5f4625dd39ab26deb860e2562b3e))
* **VEN-1274:** dynamically handle page break for all contents, handle layout with more than 3 payment dates ([06a0d80](https://bitbucket.org/bloodandtreasure/vendori-api/commits/06a0d8095cf591cfc48c1fe58a876e0ad9fa1ab8))
* **VEN-1311:** show the pdf watermark only for 'Pending Internal Approval' status ([f6248cb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f6248cb82948a711945b16269a0755efe66f9f76))


### Features

* **VEN-1256:** Workflow Approval: Channel1 doesn’t appear in the priority list ([42de371](https://bitbucket.org/bloodandtreasure/vendori-api/commits/42de371af24b15257e8947c08e4b26858b96fe51))
* **VEN-1308:** 504 if trying to use salesforce for non-existing Opp ID ([e03b943](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e03b9430e8ba80d238032bd10204b6520814ff5a))
* **VEN-1312,VEN-1310:** Don't require customer information ([eefaef5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eefaef50762c410f64146c979ec2c99c4617942e))
* **VEN-1312:** Can't submit a quote without Opp ID for internal approval ([7cc49bd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7cc49bd3677f4194387b6a71041325a1000fa355))
* **VEN-1330:** Copy Vendo: Quote id shows instead of the Vendo id when cloning a vendo ([6cfe4f3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6cfe4f3062fadc0afb4dac2c6a87b11ffa146df7))



## [1.0.5](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.4...v1.0.5) (2022-11-09)


### Bug Fixes

* **VEN-1307:** export pdf without the customer info ([b2f5c04](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b2f5c04d1dbc0cbaa55be70ee36f3ab4f1e97835))



## [1.0.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.3...v1.0.4) (2022-11-08)


### Bug Fixes

* **VEN-1302:** copy attached vendos when cloning a vendo ([9562c3e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9562c3ef3943640972e41d3c2de9404fcd3ef422))


### Features

* **VEN-1241:** delete the hierarchy with replacement ([ea9fe8c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ea9fe8cd27857835415076ccd1c5f90f6b6eeed0))
* **VEN-1300:** import pdf layout changes from frontend ([91f6c83](https://bitbucket.org/bloodandtreasure/vendori-api/commits/91f6c834d7a8d6d5d2b17f0f8652a38591299548))
* **VEN-1311:** add watermark for not-approved quotes ([0ecdcbe](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0ecdcbe99aff6c9935bb5856b1e0cc86ba6fa583))



## [1.0.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.2...v1.0.3) (2022-11-07)


### Bug Fixes

* **newrelic:** packages ([6163fd9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6163fd90267548a1d2a64dfaf93a9d1ab072c80f))
* **newrelic:** packages - tested with removed node_modules ([9f60cda](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9f60cdac8f00c4e40d701933da934515cc449c07))
* **newrelic:** packages - tested with removed node_modules & running the server ([8506185](https://bitbucket.org/bloodandtreasure/vendori-api/commits/85061850b345fd9bc3566542852e56a38662ba3f))
* **newrelic:** update NewRelic installation with the agent running ([cd29e78](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cd29e784582526648d6bfcd1d1f1756e13e94338))
* **VEN-1282:** Revert status changes for the Quote & Vendo Queue status enums ([5d5e05a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d5e05ab72b7c4964a0b3fe6b041bebc637b28c3))
* **VEN-1282:** Use the quote status & vendo status enums ([a00410b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a00410b93999bfcdc67f37cdeb5f02880cd81ce1))


### Features

* **VEN-1299:** change quote/vendo status from 'Pending Customer Acceptance' to 'Sent Externally' ([6de2262](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6de22623c10a2e0d56618930cc826c6cf3a85f3a))



## [1.0.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.1...v1.0.2) (2022-11-03)


### Features

* **VEN-1292:** change Pending to Pending Internal Approval, add Pending Customer Acceptance status ([7e54666](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7e54666f3bf605b4c846ba30f499b70565c41b54))



## [1.0.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v1.0.0...v1.0.1) (2022-11-02)


### Bug Fixes

* **VEN-1236:** fix replacing productHierarchyId ([d17d6a9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d17d6a9c4851ef1e5510c266b312854eebec8f0d))
* **VEN-1237:** fix updating productHierarchyId ([4abdcad](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4abdcad83f65bb660a3e98528a6880db224accd7))
* **VEN-1289:** show quote/vendo name instead of id for quote/vendo emails ([40c4336](https://bitbucket.org/bloodandtreasure/vendori-api/commits/40c43364fd41d7beae6e952d90ad0510537d35a3))


### Features

* **VEN-1282:** allow updating quote/vendo status to Auto-Approved ([0d08f9d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0d08f9da1dcd61fe95ffab31771c9606299376ae))
* **VEN-1290:** prevent disable admin role ([e359098](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e359098f7dd26d2c7ad2447267a594d461b15326))
* **VEN-1291:** deactivate the original approval queues and disable updating inactive queues when modifying quote/vendo ([542f2c5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/542f2c51addfcab495e73e3101d579e1e4f9899d))
* **VEN-1811:** send help/feedback emails to support@vendori.com ([22ea5d4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/22ea5d4413d84b797e010f8f81437f80af6c0542))



# [1.0.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.14...v1.0.0) (2022-10-26)


### Bug Fixes

* **data-reset:** fix seeder issues ([08135d2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/08135d2470ade4aef1dd4dd84d43e72bce72e941))
* **README:** .env.example updated ([55feda1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/55feda1f455cbbf2f186c70139a18376ffc6a313))
* **reset-data:** update seed test ([9cc82a6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9cc82a602cf89ecb499db444c030fe0ce4eba28b))
* **seeds:** copy seeds to the clean demo Index ([ceaf274](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ceaf2748780ea521c95ad86e619caf513c6c11ca))
* **VEN-1143:** send quote/vendo transacted emails automatically ([ad8ef8d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ad8ef8db170dfd5577dcb34ccd7b0f32e9a49ee2))
* **VEN-1222:** show total customer discounts and total channel discounts on the pdf ([c42dbcf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c42dbcfd6c81993802fc2668cfef86557dd0d19f))
* **VEN-1231:** There is no Catchall rule after reseting data ([7099c6c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7099c6ceda260cef876748c8ef45112c336d9ac8))
* **VEN-1233:** fix overwriting users ([86d423c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/86d423c471441e0b13e443a1362db07b517767f5))



## [0.16.14](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.13...v0.16.14) (2022-10-25)


### Bug Fixes

* **VEN-1196:** make customerId and opportunityId optional on creation and required on submit for quotes and vendos ([87b7cd6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/87b7cd65692f107f8c09d4b2de7024613bf8d00f))
* **VEN-1231:** There is no the Catchall rule in seed data after reseting data ([18769ed](https://bitbucket.org/bloodandtreasure/vendori-api/commits/18769edc9d82e43b0c4c6d90e9b6b09643d85388))
* **VEN-1233:** missing file added ([eeabd64](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eeabd64a93b089cf3279a4d8ea1581bb702a6248))
* **VEN-1233:** Some users are missing in seed data ([b87caaa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b87caaafde31a91e597fc206e19eee2a58c89ec2))
* **VEN-1234:** Channel manager role type is missing in the Approval Priority table ([849fefd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/849fefd8809fe4e82694826fbd76ba5e08ad8110))
* **VEN-1235,VEN-1210:** fix seeds ([f2c38d4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f2c38d462eda3ff5986141a47517500290a01565))


### Features

* **VEN-1146:** Rename _SEED to _JSCONF ([fe6626a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fe6626ad74bc7021f1ab2fac2dd45ef51fdd6d28))
* **VEN-1146:** Rename JOB_CONNECTION to MASTER_CONNECTION & _SEED to _JSCONF ([6295ecf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6295ecf79815ba0e7ef6710f12f5dcf67f123514))



## [0.16.13](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.12...v0.16.13) (2022-10-25)


### Bug Fixes

* **VEN-1093:** fix the main seeds, correct the default user emails matching ones with okta for demo and clean env ([a06a1c5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a06a1c5fc29def6a3a0e967d2bc6c5ff7bd5c892))
* **VEN-1199:** fix case-intensive for quotes-and-vendos ([7898e98](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7898e98b722e3d898856b6681af05fc624d3ca8f))
* **VEN-1221:** sort vendo quotes by created_at ([21407d8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/21407d8b5728aec2f0035db9583d8d7a38186004))


### Features

* **VEN-1219:** show vendo contacts in pdf ([49e060b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/49e060b9b8befff33a0e1df51b296f76a16a6a2b))



## [0.16.12](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.11...v0.16.12) (2022-10-24)


### Bug Fixes

* alter vendo.vendo_uuid ([eff1df2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eff1df2ddf6a8d3e3eb8108cce1f2f06f1e218e6))
* **seeds:** add customers ([1fd2b6e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1fd2b6e6d3c5ba1e2b24ee5ec72f995e8aed3e4e))
* **seeds:** update the seeds so we only include nessecary information for testing ([e12282f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e12282f9e6b78e2f4805e4bfdd3d4acd4aa0409c))
* **VEN-1093-4:** fix typeorm-seeding connection configuration ([702c273](https://bitbucket.org/bloodandtreasure/vendori-api/commits/702c2736a760fd44fa16a9a5a574b9edf855e298))
* **VEN-1139:** create shipping address for a salesforce customer ([60af374](https://bitbucket.org/bloodandtreasure/vendori-api/commits/60af3745d146bb8223d56d9bbffec9b60486ed18))
* **VEN-1160:** generate new pdf and delete old pdf to prevent the cloudfront cache issue ([ca4eeb7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ca4eeb7d04b308f1a8a9d295268c0840ae7f8806))
* **VEN-1175:** fix dynamically updating ([eeba858](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eeba858e8e7826f4162624b624883f727fd6a598))


### Features

* **expalin-util:** add expalin util ([5f15cd8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5f15cd802ae5a7b1c51c1cef3fe84d893919546f))
* **VEN-1086:** integrate NewRelic for server monitoring and logs ([f38f7d2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f38f7d2735b26b794ad86c64d90bc6622df77a5d))
* **VEN-1174:** refactor create queryRunner for increase perfomance, add TYPEORM_EXPLAIN ([f49c5da](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f49c5da3df043165dab83d2eed59e49e13b9258a))
* **VEN-1192:** do not allow any user deleting a transacted quote/vendo ([66ff1af](https://bitbucket.org/bloodandtreasure/vendori-api/commits/66ff1affa1d3c42934b7c4a7521a96dbd3309f2f))
* **VEN-1213:** import new PDF changes to the API ([8f1cae6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8f1cae6735f2657a6512904341b482b28f7000e7))



## [0.16.10](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.9...v0.16.10) (2022-10-18)



## [0.16.9](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.8-b...v0.16.9) (2022-10-18)



## [0.16.8-b](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.8...v0.16.8-b) (2022-10-17)



## [0.16.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.7...v0.16.8) (2022-10-17)



## [0.16.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.6...v0.16.7) (2022-10-12)



## [0.16.11](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.6...v0.16.11) (2022-10-19)


### Bug Fixes

* **commit-msg:** update lint rules ([382c39e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/382c39e8024787ad29d35fcbb57184107a50ac9c))
* **multi-tenancy:** when deploying to a separate environment with different table names we need to drop all policies for all tables first, before creating new policies for new tables ([001b5cd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/001b5cd22cdbd336b6de4352ce87963fc8eea609))
* **test:** fix test ([d91fc2c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d91fc2cf23793f644b542bf8ae0850a615de8b94))
* **VEN-1093:** fix resetting database ([363a599](https://bitbucket.org/bloodandtreasure/vendori-api/commits/363a5996072049174606dadf027af1244821e031))
* **VEN-1097:** show vendo comments ([b347daf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b347daf51b026e5eb5a87c70f3acd45cb7a1becc))
* **VEN-1153:** copy all relations for quotes and vendos on clone ([5923894](https://bitbucket.org/bloodandtreasure/vendori-api/commits/59238949bfc4a78306c9513f5d488455d39a8065))
* **VEN-1160:** always generate new quote/vendo pdfs on export, use the same key to overrite the existing pdf for the same quote or vendo ([e8b5092](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e8b50921f9adaf4ab05ee0a10455a5c4552d4764))
* **VEN-1194:** allow admins to see all quotes and vendos regardless of assigned status ([6f30715](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6f30715530770357e15b7f9026ad2f38613c195d))
* **VEN-1200:** fix tests for quotes-and-vendos endpoint ([88022ca](https://bitbucket.org/bloodandtreasure/vendori-api/commits/88022ca454239ec4d15ff9545c59818db7cb993c))
* **VEN-996:** correct the logo for vendo emails ([2d77e42](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2d77e42c59cf7558942432e12f3c94d82d2e7ade))


### Features

* **VEN-1093:** make db:seed command working with a custom db config ([a67ba6a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a67ba6ab0f35687e5d66dde1b20bd44c613cb72b))
* **VEN-1168:** allow admins to approve any quote ([02e65ca](https://bitbucket.org/bloodandtreasure/vendori-api/commits/02e65ca29e508df8762c52ce7c158aebaed13693))
* **VEN-1175:** dynamically update approval priority ([57779d1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/57779d1ada1f2c96c817e2c936e8b2fa66c4fae7))


## [0.16.10](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.9...v0.16.10) (2022-10-18)


### Bug Fixes

* **VEN-1200:** fix tests for quotes-and-vendos endpoint ([88022ca](https://bitbucket.org/bloodandtreasure/vendori-api/commits/88022ca454239ec4d15ff9545c59818db7cb993c))


### Features

* **VEN-1175:** dynamically update approval priority ([57779d1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/57779d1ada1f2c96c817e2c936e8b2fa66c4fae7))



## [0.16.9](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.8-b...v0.16.9) (2022-10-18)


### Bug Fixes

* **VEN-1160:** always generate new quote/vendo pdfs on export, use the same key to overrite the existing pdf for the same quote or vendo ([e8b5092](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e8b50921f9adaf4ab05ee0a10455a5c4552d4764))
* **VEN-1194:** allow admins to see all quotes and vendos regardless of assigned status ([6f30715](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6f30715530770357e15b7f9026ad2f38613c195d))



## [0.16.8-b](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.8...v0.16.8-b) (2022-10-17)


### Bug Fixes

* **VEN-1093:** fix resetting database ([363a599](https://bitbucket.org/bloodandtreasure/vendori-api/commits/363a5996072049174606dadf027af1244821e031))
* **VEN-1097:** show vendo comments ([b347daf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b347daf51b026e5eb5a87c70f3acd45cb7a1becc))
* **VEN-996:** correct the logo for vendo emails ([2d77e42](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2d77e42c59cf7558942432e12f3c94d82d2e7ade))


### Features

* **VEN-1093:** make db:seed command working with a custom db config ([a67ba6a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a67ba6ab0f35687e5d66dde1b20bd44c613cb72b))


### Reverts

* Revert "fix(reset-env): packages needed to be re-installed" ([78d05b2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/78d05b2f6b47014e63c734da6bc734ee45022ba2))



## [0.16.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.7...v0.16.8) (2022-10-17)



## [0.16.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.6...v0.16.7) (2022-10-12)


### Bug Fixes

* **commit-msg:** update lint rules ([382c39e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/382c39e8024787ad29d35fcbb57184107a50ac9c))
* **multi-tenancy:** when deploying to a separate environment with different table names we need to drop all policies for all tables first, before creating new policies for new tables ([001b5cd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/001b5cd22cdbd336b6de4352ce87963fc8eea609))
* **test:** fix test ([d91fc2c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d91fc2cf23793f644b542bf8ae0850a615de8b94))



## [0.16.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.3...v0.16.4) (2022-10-10)


### Bug Fixes

* **quotes-and-vendos:** typo, userId should be user_id ([7c5c127](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7c5c127fbd67d36fd3a4da8b96fb4a1720b9e87a))
* **VEN-1063:** correct the error message for duplicate login email when creating a new user ([08c27e4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/08c27e45b0cd05e4ff83150572c4a8a0d2690ff6))
* **VEN-1093:** use the correct super connection to reset data ([6891cad](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6891cadf6ec795af1b04bae6e9e9f1bebde048dd))
* **VEN-1118:** revert VEN-1118 ([d2b6265](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d2b62657dabb23028de5dbf4cf05bd84af73ad91))
* **VEN-1124:** fix creating approval queues for external users ([3b31eb3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3b31eb3630488c231d5c49e5d3c4a3c7d69a785b))



## [0.16.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.2...v0.16.3) (2022-10-09)


### Features

* **VEN-1111:** add clusterizing ([b30b8a7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b30b8a77679f254dddb8346a7964f7a735026ae0))
* **VEN-1111:** add clusterizing ([3d706ac](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3d706ac19eb41f0cc33b97c0422aff222a261e61))
* **VEN-1118:** show only your turn ([9c6001d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9c6001d016d743fc53fe3a59cb284c12f00c9de6))



## [0.16.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.1...v0.16.2) (2022-10-09)


### Bug Fixes

* **VEN-837:** fix geoHierarchyId update in users ([b1c08c9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b1c08c9675256e89dd0f76597e09475ad002a9d9))


### Features

* **VEN-1105:** save pdf to quote/vendo model after submitting or exporting ([2dfc6fd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2dfc6fd463d31a72e8bb6b04ddea14bb6ca2b9b3))



## [0.16.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.16.0...v0.16.1) (2022-10-06)


### Features

* **VEN-1084:** have one address per company, 2 addresses per customer ([2ba8dd3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2ba8dd3890a5d7c3f945da3f593ee022b566317c))
* **VEN-1084:** make only one company address ([d79e5df](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d79e5df8b9423151bd7118c0bfd6e5254eb2f8b5))



# [0.16.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.15.2...v0.16.0) (2022-10-05)


### Bug Fixes

* **file-structure:** the file structure is messy and hard to navigate ([d6107aa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d6107aa0cd4fb449a7514e55682eb4ee7723b26b))
* **isApprovalTurn:** add isActive filter ([e3a8c42](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e3a8c4293689148f9cd509ebd0191f178919aa31))
* **merge:** merge issues ([e272336](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e272336817c95234c18f9bfb3f0dacd5dc0b64be))
* migration for quotes-materials and vendos-materials ([2878834](https://bitbucket.org/bloodandtreasure/vendori-api/commits/287883491e8b56a730e5d3b7b749d36dcc536604))
* **migrations:** cannot assign not null for a new column with pre-existing data ([9545dd5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9545dd53a42ffca5725c10eb724c1039e2022daa))
* **notification-preference:** fix scope ([c273419](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c27341998a532861a6dfd3d9643a9bf15842d7f1))
* **pending-approval:** fix dublication ([48c81a7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/48c81a7eee248a033e1fca7c35d9051dd5388efa))
* **q:** fix q ([c13a553](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c13a553df2451e8ed13af7550dc297b76d3d63a6))
* resolve merge issue for demo seeds ([c12d1c8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c12d1c83a91ff0aac93e563fa2b3bf85f3ebf3d5))
* **typo:** q.vendo_id should be v.vendo_id ([86c26f3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/86c26f3fef0c22b1194a5cd36469ce179d5393e6))
* **VEN-1053,VEN-1049:** pass isOwner ([1d26639](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1d266395a60ed873814f16a993c724ffa097972a))
* **VEN-1106:** move quote-approval-queue confirmation link to CTA ([a9a1a21](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a9a1a214cf77f18e973c77414028997db500006e))
* **VEN-962:** fix revert migration ([eb26c06](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eb26c06cc7bd6da9a864cb7e1cb6f2fc0e64a3fc))


### Features

* **VEN-1083:** add quote/vendo materials ([72f4165](https://bitbucket.org/bloodandtreasure/vendori-api/commits/72f4165c7b49caa90b5a3901d4f47366f773881e))
* **VEN-1083:** update quote/vendo material position ([384e3b6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/384e3b696d8a05a2ae40fdb23637d464d75f5dec))
* **VEN-1093:** seed for staging ([a8fee2d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a8fee2da0a7a69f40a98da318dc812f984b1bfbb))
* **VEN-962:** change deal_partners to quote_company_channels ([cc4c043](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cc4c043b344c72a03fd83082a953712ff9d7855a))



## [0.15.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.15.1...v0.15.2) (2022-10-02)


### Bug Fixes

* **fix delete user:** fix delete user ([8bfd090](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8bfd09035125470d30f6795a598cd014fc3c79ff))
* **fix:** fix roles seed ([8f8df67](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8f8df672e86fe29320b6447ebb2639c335be4db2))
* **multi-tenancy:** discussed issues ([180b697](https://bitbucket.org/bloodandtreasure/vendori-api/commits/180b6978cde8c8ebf48ef8ffff6d1ff39eefe765))
* **PR:** fixes ([26f829d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/26f829db49d9ccfed9fa3c019040f669f784dbce))
* **VEN-1072:** change quoteId and vendoId to quoteName and vendoName in emails ([a1b9142](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a1b91429b843c0991d1a02a75ff97753a016fc7d))
* **VEN-1075:** remove duplication ([1c77fe7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1c77fe7da368ceee0ae50f856ce4a37ebd584431))
* **VEN-1090:** do not show company or customer logo if non existing ([9524be1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9524be1eed12f29183dfe134ee7bc107d36f11d3))
* **VEN-1096:** defensive check for pricingModel missing in lockedFields ([bbc8e4f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bbc8e4f587a746f522d8ef038c1643d0ed277428))
* **VEN-886:** use overriding connection ([94a24fa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/94a24fa46005174aa26520240212b9510f7f6007))


### Features

* **VEN-886:** refactor multytenancy, support seperated connections ([c4037fe](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c4037fe54a5eb00414b18dc5506e09841fa24d53))



## [0.15.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.15.0...v0.15.1) (2022-09-28)


### Bug Fixes

* **VEN-1071:** edge case when there's no quote products ([61e4598](https://bitbucket.org/bloodandtreasure/vendori-api/commits/61e4598abb7466e2d6c03343d11e9552b753a41a))
* **VEN-1071:** resolve fonts, images ([c91d888](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c91d888f2f9b7dd42ee843c37f6888747f06ca4a))
* **VEN-1084:** sort company addresses by addressId, show address email instead of companyEmail on the left sidebar ([2911e18](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2911e182ba51999f876569449bafb04bf6cd5638))
* **VEN-891:** if a tenant is not set, ignore and return the function (for background jobs) ([386b4f3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/386b4f3d40d4b2ffefdcb002ab7306fe38f80915))


### Features

* **VEN-1071:** copy codes from vendori-api-pdf-export ([5ebc024](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5ebc024ee75f73931bc8edd82a293cac9af0fbbb))
* **VEN-1071:** implement exporting vendo pdf ([8ebfcd0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8ebfcd096941357a83033dbebf432b4229f84d13))
* **VEN-1071:** mock edge cases, fix the edge case when there's no quotes attached to the vendo ([41a2716](https://bitbucket.org/bloodandtreasure/vendori-api/commits/41a27165757a8b51f9b11bfd245bb7e59980f481))
* **VEN-1071:** replace logos, quote details, and deal information ([4536a64](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4536a6488521ad3c1c14a9fcc5279f22c4f26e96))
* **VEN-1071:** replace mock data for default quote ([c394b0e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c394b0e62c0cdee4bdb50d997780bad164e83f58))
* **VEN-1071:** update exportPdf to generate a pdf for quote and merge with material pdfs ([a363112](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a363112701bc4a3d8707552db25326116b8e09eb))
* **VEN-1071:** WIP add an endpoint to export a test vendo pdf ([294dfb9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/294dfb933eb5218994b94986f463925ae26a0477))



# [0.15.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.14.1...v0.15.0) (2022-09-27)


### Bug Fixes

* **VEN-1009-fix-migration:** fix the migration files for existing records ([44bed64](https://bitbucket.org/bloodandtreasure/vendori-api/commits/44bed644a11b10beb317d823837ef4ac5d33c2a1))


### Features

* **VEN-826:** send support email with attachment ([cf414b0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cf414b0e3db4531a672452f4b8de831159d9d57e))
* **VEN-826:** WIP for support-email to switch into another branch ([687d9af](https://bitbucket.org/bloodandtreasure/vendori-api/commits/687d9afc71011e2201242128db4dbbaf5250cda1))



## [0.14.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.14.0...v0.14.1) (2022-09-20)


### Bug Fixes

* **connection:** fix close connection ([0010c21](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0010c211e2704c5a3174294d3bc7900f16df0aca))
* **fix:** fix round ([819ab31](https://bitbucket.org/bloodandtreasure/vendori-api/commits/819ab311e144f6213361f4c0cd4d0ffc21b85408))
* **quote:** fix quoteApprovalQueueId - undefined ([d259621](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d259621884d3c497e36303040eb801ae544f5707))
* **VEN-833:** forbid innactive user login ([566c234](https://bitbucket.org/bloodandtreasure/vendori-api/commits/566c234e024bf20960f43eaeb7f8edef2fdd9ab4))
* **VEN-966, VEN-1059:** fixes ([dbded5e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dbded5ef4296c89559105c30f2fca284d5b80b5a))


### Features

* **VEN-1009:** fix rls issue ([9ba0a51](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9ba0a51c1c23559bba529adfe5c1720fc1bc3f86))
* **VEN-548:** fix replace update one ([eb2610b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eb2610b2f75b4498436fefc6c4b8cf9e5973ecc5))
* **VEN-548:** fix replace update one ([2957ce9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2957ce96445c96da83e4e3ae5a808ad8ca33b412))
* **VEN-966:** replace logo ([94e91fa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/94e91fa790f3460ac4a0d3de99672162f4bef316))



# [0.14.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.13.1...v0.14.0) (2022-09-20)


### Features

* **VEN-975:** initial setup for settings module ([dc2ecb7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dc2ecb762cfc95423efd4eeddf0e6a6bda7ba777))
* **VEN-975:** seed for clean demo ([169492e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/169492e720f9658585fa0fcc45b9e619ea967a0b))
* **VEN-975:** seed for demo ([d202635](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d2026351ba66db6641aa9aff95a54cb7dd0b10b9))



## [0.13.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.13.0...v0.13.1) (2022-09-16)


### Bug Fixes

* **VEN-1049:** check the user's createAccess when creating quote/vendo approval queues, fix vendo approval queue ([710c627](https://bitbucket.org/bloodandtreasure/vendori-api/commits/710c627adac79d492e2f6e92934b29a1046d5adb))


### Features

* **VEN-1049:** add missing guards for quote/vendo approval queues, quote/vendo clone ([d5c925e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d5c925e5043b4809f7aea7ceec0c65a9b52a7249))



# [0.13.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.19...v0.13.0) (2022-09-14)


### Features

* **VEN-883:** apply dataAccess to quotes-and-vendos endpoint ([0554de2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0554de2e2cff0584d3e01f74ce16ef62b9d7b2ac))
* **VEN-883:** apply dataAccess to recently-viewed-quotes-vendos ([b26aae0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b26aae03e4b93ec89d5fe5d8d24a72795d42fc99))
* **VEN-883:** implement casl factory to apply roles ([76840b9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/76840b9a47327a11d9f0dd704510e6c6f41a30bd))
* **VEN-883:** implement roles guard for quotes ([204bd8d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/204bd8d7b6b43a1b5c6db53c30296e960e63f648))
* **VEN-883:** implement roles guard for quotes and vendos ([a20996e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a20996e76cbd715d2d6b9f936989b92b4ec14f26))



## [0.12.19](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.18...v0.12.19) (2022-09-14)


### Bug Fixes

* **VEN-1011:** remove the phone number validation for addresses ([60c45e7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/60c45e7bd706eb724248f1876dddcb2622bb1cf8))



## [0.12.18](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.17...v0.12.18) (2022-09-11)


### Bug Fixes

* **VEN-1006:** fix seeder for catchall workflow rule ([a6dfef4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a6dfef4b1a4f2871efaeabac41f516536f31ec13))
* **VEN-1047:** fix seeder for visible product fields ([eb1e094](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eb1e0944d8f1252501afbce884011a0521b4038a))


### Features

* **VEN-1006:** add seeder for missing catchall workflow-rule ([7c07f5e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7c07f5e8cc49d4e8e8460b8c9aa814c4d114c973))
* **VEN-1027:** allow join for ownerUser on workflow-rules endpoints ([2883b56](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2883b56ee917a631f9f391fa804c11e38b900617))



## [0.12.17](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.16...v0.12.17) (2022-09-06)


### Features

* **VEN-877:** delete user ([b1abaa1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b1abaa1b62140d2500f5e0acc60d3dbdf7ef0f28))
* **VEN-943:** approval by roles ([138dedc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/138dedcecf26f2002d6e52afe77458aa01f58415))



## [0.12.16](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.15...v0.12.16) (2022-09-05)


### Features

* **VEN-1024:** unlock quotes and vendos when setting status back to Draft ([5dc33a7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5dc33a7622fe4a9d69cb401167989abc1be87d4b))
* **VEN-938:** format currency for quote emails ([3c450a8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3c450a81d6d0075090c7d0494e295fc08b71761b))



## [0.12.15](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.14...v0.12.15) (2022-09-02)


### Bug Fixes

* **VEN-1002:** bring back lost changes for saved alert user emails ([84fed00](https://bitbucket.org/bloodandtreasure/vendori-api/commits/84fed00082818353301517f73ad24631d426dde7))
* **VEN-835:** update hierarchy-levels seeder to disallow editing for levels less than or equal to 3 ([e5b5a7d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e5b5a7d3bf7abbe89c76f447b71396468788aaec))
* **VEN-959:** replace PATCH to PUT for company-channels ([b5d29fe](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b5d29fe76fd0f06066e69b37799cd8ef5cc8ff5e))


### Features

* **VEN-913:** unlock all quote relations when putting it back to Draft ([4734ad3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4734ad33359b5daaa486ea8371532a85ca696af1))



## [0.12.14](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.13...v0.12.14) (2022-09-01)


### Bug Fixes

* **merge:** post-merge fixes ([cd98e67](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cd98e67730d186c39d19fd11e01667f1e6d1aa63))
* **salesforce:** existing endpoints don't work ([7c428b4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7c428b4ae7e58fac2a67c254e92a45b4e721f63d))
* **VEN-1002:** enable SetCurrentTenant decorator back ([2e9ae5b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2e9ae5be03ff626876db562ef0fd65240d24bcc9))
* **VEN-1002:** enable SetCurrentTenant decorator only for tests ([4dcfad0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4dcfad01699a4d00a136b4082164f555fb047a3f))



## [0.12.13](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.12...v0.12.13) (2022-08-31)


### Features

* **VEN-382:** add external user ([e56af54](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e56af54f19487460d2b2127288aceec4f38b69ec))
* **VEN-971:** sort quotes-and-vendos by updatedAt by default ([db12ced](https://bitbucket.org/bloodandtreasure/vendori-api/commits/db12cedfdfd90671373c8287af5e2f5a68231637))


### Reverts

* **VEN-973:** disable crop images ([da064cd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/da064cd44c87bf811641c19972d78af2f2519c2b))



## [0.12.12](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.11...v0.12.12) (2022-08-29)


### Bug Fixes

* **multi-tenancy:** do not include API subdomain parts while using swagger to make requests ([834115b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/834115bed0707c1f1c10f43eaa57ecaf84cc2ee1))
* **typo:** Index - VENDORI_INTERNAL_RECEPTION_EMAIL ([d02ac9d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d02ac9d45d5a0e011d9d8f6c67c260f1ae16dec7))


### Features

* **VEN-735:** add charts ([da3b5c2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/da3b5c2dd404a46f23222336c6bf2c9e73b3add7))
* **VEN-735:** add dynamic charts ([bec5d73](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bec5d73aef46cd126f543bf7b5760db80833a393))
* **VEN-735:** add dynamic data, add merge pdfs ([e47ea11](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e47ea11481d236059d8f72ec2ccca5f7c0940648))
* **VEN-735:** add main data to pdf export ([b1623c0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b1623c00fc3f913bb708caa8814ee78c71d799ca))
* **VEN-735:** add pdf merging with materials ([cd4a73f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cd4a73ff2bfe5dd17fab9f5780ca5ec428610cc1))
* **VEN-753:** add customer section, add flexible borders ([206da4c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/206da4c9b6fd5a3dc60be18e0aa1b1f72cb18441))
* **VEN-753:** fixes uuid, company names, lables ([b116e83](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b116e83f960df541faf0d86ffe6d608bf326d15e))



## [0.12.11](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.8...v0.12.11) (2022-08-29)


### Bug Fixes

* **VEN-607:** service fixes ([4263b12](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4263b127a9375a78961da84aad60bf2aaff4c1f2))
* **VEN-835:** add back isActive to hierarchy-levels to allow checked/unchecked on the frontend ([32d7d6c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/32d7d6c62914513e130f145e9d82642a223f0cb6))
* **VEN-923:** cleanup ([0381aa1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0381aa1bc9933f632fca70b6aaabd317a0c07a9c))
* **VEN-923:** Login does not work ([97cd1d5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/97cd1d510e5543663211b6e5528d9789b4b30289))
* **VEN-936:** fix typescript compilation error for presigned url generation ([5274695](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5274695c9c2fce83e879193278c1048a8b97d609))
* **VEN-936:** Typo: Increase the pdf source length ([b55c683](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b55c683cf6a6f65604f16b3f310f060ffe5ad849))
* **VEN-936:** URL signing does not work for images or PDFs ([73bd0c6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/73bd0c605ad7d69e31943a26d5ba7e180e235e64))


### Features

* **env:** fresh environment added ([17a61a6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/17a61a6efbc0e412e8c50a5ce497dfae488d2b4e))
* **VEN-607:** add send externally quote ([6322482](https://bitbucket.org/bloodandtreasure/vendori-api/commits/632248273e47efcc497103f9f3ce19d4bad64261))
* **VEN-607:** add vendo send externally ([8f3351d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8f3351d69f717cd0a5a080463d7d6e0224d90ba7))
* **VEN-607:** cover approval queues by test, fix reactive queue ([7bfec01](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7bfec019251c287f05085f6ee4e901313f96ab36))
* **VEN-902:** add companyChannelId to users, update unit tests ([c5d473b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c5d473b0a271ffe83fdc8f1d38e2dd0ae0692bfd))
* **VEN-902:** change company-channels endpoints ([f28adf5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f28adf54a1d1cfeb720ca12280cba26c18f84e3b))
* **VEN-902:** fix migrations, write unit tests ([9316bc7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9316bc777bb57f5b426d5f2868be829ea88f8f63))
* **VEN-902:** implement channels module ([5b1b8e7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5b1b8e7ac0ef47ed4a9f34505ef5dfd7747405fd))
* **VEN-902:** implement company-channels, company-programs module ([c447ae4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c447ae40462d6193ecc7091117d682160f907483))
* **VEN-902:** record action-logs when updating company channels ([b77369d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b77369d01605132c463d807a77d3603b317a0944))
* **VEN-902:** send an internal email to request a channel ([dc3181f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dc3181f092ec8e42961b600c7af022e65f7d24ab))
* **VEN-936:** Increase the pdf source length ([0350cab](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0350cabbac52d754dc41e81c291beb64e8ba0030))



## [0.12.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.6...v0.12.8) (2022-08-24)


### Bug Fixes

* **general:** typos, broken Index, & migration issues ([ce92d86](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ce92d8633c0765a8712e675ebfbc1819c99454b1))
* **recently-viewed:** fix group BY ([69e0a88](https://bitbucket.org/bloodandtreasure/vendori-api/commits/69e0a888d243c793dcc112359095005d45059399))
* **VEN-920:** account for manual users for stats endpoints ([121d508](https://bitbucket.org/bloodandtreasure/vendori-api/commits/121d508b9b8723b4f5844ba30511476680c41b90))
* **VEN-920:** account for manual users for transacted emails ([1780c96](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1780c9662d05278322109268e0c6c4774faeffee))
* **VEN-920:** account for manual users on quote/vendo resubmission ([f605eb7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f605eb7b55387705cfa57135b068877e1ea5839e))
* **VEN-920:** account for manual users, exclude the customer from a quote/vendo expired email ([d7e536a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d7e536ad5a03c7819997909a82fcd3c402a467d7))
* **VEN-920:** attach hierarchy_name to workflow-pending-approval, sort by concatenated fields ([cef10df](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cef10dfe87546f1aea18bbb8e9c35caaba02735e))
* **VEN-920:** correct the wrong merge for quote submit ([7cc4f7d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7cc4f7d5a9d5bdffb53ec6b0170eb47c73b1f4dd))
* **VEN-920:** prevent printing logs for SetCurrentTenant decorator, exclude the test pdf file from git, fix compilation error for pdf-exporter service ([08ee58c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/08ee58c9143c183df89ba8f41966a7e217ca94c4))
* **VEN-920:** return quotes only that the current user is attached to ([984a47c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/984a47c8791da98cc7badabc21dd55ce8e309085))


### Features

* **VEN-795:** add auto creating user, add subdomain redirect ([a92dd70](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a92dd70f08e7c8c08cf1ceb75dd66ee6bb58f464))
* **VEN-870:** implement PATCH /users/:id/reassign/:targetUserId endpoint to reassign all quotes and vendos to the replacement user, fix sending quote/vendo approval emails ([8b26517](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8b265170840225bdff42ebbf309d45639ad5e570))
* **VEN-918:** add locked fields to quotes-vendos ([0ded411](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0ded411fbe091a3dc02e0f4b7997a0bca5a7cd11))
* **VEN-920:** implement GET /quotes-and-vendos/all ([2393889](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2393889f386c2f774528788ae471a3cc96d43841))
* **VEN-920:** implement GET /quotes-and-vendos/pending-approval ([0057bb3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0057bb3129becd53236e1adc2afc0d91229f9e1b))
* **VEN-920:** implement GET /quotes-and-vendos/workflow-pending-approval ([154726b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/154726b2a8f39b15683d3a9d4d949e384826f736))
* **VEN-936:** Increase the image length ([a363167](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a3631678018a38234fd0c160f8d6cfea11a574ae))
* **VEN-936:** URL signing does not work for images or PDFs ([6bbf746](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6bbf746d3839bca1190836f18757167906a576f1))
* **VEN-942:** add isApprovalTurn ([714dd08](https://bitbucket.org/bloodandtreasure/vendori-api/commits/714dd08562f0c5e2529cb3d0a1e12d489399fce0))



## [0.12.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.5...v0.12.6) (2022-08-18)


### Bug Fixes

* **VEN-920:** correct the wrong merge for quote submit ([f881c41](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f881c41c899ec7189c0ff36c044b48c23e684eb8))
* **VEN-920:** prevent printing logs for SetCurrentTenant decorator, exclude the test pdf file from git, fix compilation error for pdf-exporter service ([a874763](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a8747631bf46e1498daebe7869932131cb1371cd))
* **VEN-920:** return quotes only that the current user is attached to ([e2e8e5b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e2e8e5b218a0168ba1c55763c0addc6f7bd60ceb))


### Features

* **VEN-843:** add total request for recently viewed ([75b8f55](https://bitbucket.org/bloodandtreasure/vendori-api/commits/75b8f55b003ac701c4614f271255e580f2ba726c))
* **VEN-904:** Hierarchy Manager: Can’t add a new hierarchy node ([4c97fa2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4c97fa2439827688288abb47a886f00e81f30943))
* **VEN-920:** implement GET /quotes-and-vendos/all ([d350bdf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d350bdf91815cb805627fbc78304334831634dae))
* **VEN-920:** implement GET /quotes-and-vendos/pending-approval ([9d6964f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9d6964f6fa07bd439553246f03a738d05e5366de))



## [0.12.5](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.4...v0.12.5) (2022-08-11)


### Bug Fixes

* **multi-tenancy:** quote users & submitting a vendo or quote ([6044675](https://bitbucket.org/bloodandtreasure/vendori-api/commits/604467514314e81c49074c57718c9ddefbf7f05f))
* send quote/vendo expiry emails ([a2ff0b4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a2ff0b4f97da6194391522f8e04e55dbb8724881))
* **VEN-828:** allow updating quote/vendo status back to Draft ([d31e7b0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d31e7b0cc6d28f588fa95b71278ee43479628175))
* **VEN-866:** update isLocked on update of quote/vendo status ([75946b7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/75946b7d9ea91bcb8b328177a33dd0919a973b66))
* **VEN-868:** fix sending approvals to different users at the same time ([8bfb044](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8bfb044551afd70bf8947670700fb02b7351a699))
* **VEN-897:** Quote: Can't go to the page 2 without errors ([534fbda](https://bitbucket.org/bloodandtreasure/vendori-api/commits/534fbdaf5c81a30eb61da18204b142917c66e50e))


### Features

* **VEN-735:** add table in exports ([3c356ee](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3c356ee3ebe5c3878f6c699d703bf407720a3fc1))
* **VEN-735:** fix table styles add charts basic ([6849914](https://bitbucket.org/bloodandtreasure/vendori-api/commits/68499146601b66d9cb4d13d93d4dcd2dffa63771))
* **VEN-735:** stylying code ([817d97c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/817d97cea54bb57b791d69b9b2dc9f224e76fa55))
* **VEN-835:** rename isActive to isEditable and set false for LV1~3 ([774acb3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/774acb32a7f5cc53d4af70ee95bcf77dc292a74b))



## [0.12.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.3...v0.12.4) (2022-08-08)


### Bug Fixes

* **VEN-793:** enable filtering assigned only quotes/vendos back, which were disabled with a wrong merge ([de76e82](https://bitbucket.org/bloodandtreasure/vendori-api/commits/de76e82a482092b6466629d268b786da2bc57638))
* **VEN-856:** filter by a current companyId, swagger params ([5814d16](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5814d16d6bf6220294a9e3593ae24be00a53a54c))
* **VEN-857:** return users only with the same role as the current user ([d57c9e4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d57c9e4183c23e90df7434626f52692117b8ebca))
* **VEN-895:** disable transactions in jobs ([a283ba0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a283ba0edd02526f8b9056fafe2accb869c79be9))


### Features

* **VEN-856:** implement GET /stats/top-customers ([0579ef4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0579ef4466ffd802dab01a297abe7f861e0a2f0b))
* **VEN-857:** implement GET /top-approvers ([03f8c81](https://bitbucket.org/bloodandtreasure/vendori-api/commits/03f8c81a797216d51ae182dda763172f01c69df0))
* **VEN-858:** implement GET /top-creators ([8a3ee2b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8a3ee2b8b106c2ee38d4f5d7622763a3e9d7af5f))



## [0.12.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.2...v0.12.3) (2022-08-05)


### Bug Fixes

* **env:** fix env issues ([fe0d634](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fe0d634a7093aff85cdddb0a4b0b721c4533f152))
* **fix:** fix password variable ([8018ad4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8018ad43af749d12bef89c4079de88284e215641))
* **migrations:** add commented out migrations back in ([8130b68](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8130b6822b1d209805b3fc65aec82fe39d00f770))
* **multi-tenancy:** migrations: enums already exist ([eb584d7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eb584d7e5f19c16e2315b48357d3ae735509fd11))
* **orm:** rollback orm changes ([27ef10f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/27ef10f7a7307be9ad132e5d7e44ebe4431265e6))
* **test:** fix recently viewed test ([10a317d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/10a317d5f11c139b179c2639831994070828ed8a))



## [0.12.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.1...v0.12.2) (2022-08-04)


### Bug Fixes

* **multi-tenancy:** automatically use the correct db name ([8b1c6b6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8b1c6b6c0dac26452530c5caeb18ec84a5cd74e7))
* **multi-tenancy:** ormconfig overrides the DB connection ([275d26f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/275d26fc1324194c5913cd69f24a958e3eb5bc46))
* **quote-products:** when creating a quote product, the company id is not persisted from the user ([b74d149](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b74d1499477611aeb478756e9ff75494392d93d2))
* **VEN-804:** fix quotes-and-vendos search ([9c56165](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9c56165a4f9fa7b326359c10f6a375700639b0de))
* **VEN-804:** resolve merge conflicts ([45f3886](https://bitbucket.org/bloodandtreasure/vendori-api/commits/45f388604bc5ea123b78816ac6e4a597c4b8817e))
* **VEN-853:** disable approval queues and notifications for the specific quote when resubmitted ([287f196](https://bitbucket.org/bloodandtreasure/vendori-api/commits/287f1961c6cce0ed8223838381d08624babcead7))
* **VEN-853:** send quote/vendo emails to saved alert users in background, fix attaching users to vendos ([aab6615](https://bitbucket.org/bloodandtreasure/vendori-api/commits/aab66156cd4f2ed702e968bba44eb5c98ca98c63))
* **VEN-855:** fix creating recently-viewed-quotes-and-vendos for vendo ([cb513ff](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cb513ff36c63b36962b115da2f253d64bae8681d))
* **VEN-855:** fix searching recently viewed quotes and vendos by name or uuid ([ded10ca](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ded10ca0e225c71495eabcaecbd15ef1c4fcf02f))
* **VEN-886:** fixed job connection provider, fixed role decorator ([3cd8dd8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3cd8dd80733edf2c49bec47153feac7c8481867b))
* **vendos:** recently viewed vendos did not save because the company id was not set ([45099e2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/45099e2c070d3c8602e2f7a6984bb92442413080))


### Features

* **update env:** update env and readme ([84b20b4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/84b20b4669f103c2e1449ed1eba094c2d8f63f3a))
* **VEN-853:** add migration for saved-alert-user ([d0b47a8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d0b47a87caf212b7452c3e2184eaf600ae8ca3d8))
* **VEN-853:** dto for approvalStatus, isSavedAlertUser, isWorkflowUser ([04d2d6e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/04d2d6e045c362a399874f2389560d5e795e6c69))
* **VEN-853:** send quote emails to saved alert user ([7c19a1a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7c19a1ab914e157060cdcb77771fc4f9cf23edb4))
* **VEN-853:** send vendo emails to saved alert user ([fc14301](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fc14301139d1703d024e41f4a26d60f750520636))



## [0.12.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.12.0...v0.12.1) (2022-08-03)


### Bug Fixes

* **MASTER_CONNECTION:** fix auth job connection ([b23e5b7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b23e5b75bf0ac664d1d29875dfc967116c0325bd))
* **migrations:** typos fixed and duplicate migrations are removed ([dfc1709](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dfc170902a95ba7c03c8255498ec8f4d7a815c2b))
* **migrations:** update SQL files ([930f167](https://bitbucket.org/bloodandtreasure/vendori-api/commits/930f167f02bd9bb85651bb52c5b8e6c3b7404ba0))
* **migrations:** update table owner ([1490b2d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1490b2d07bb64f08be3e7229c56f9906731cbe5b))
* **shading rules:** allow for the use of shadingRuleLogic while creating ([4e65789](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4e65789a93d29b17d469b5a8e5bbfc42a0a76a39))



# [0.12.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.11.1...v0.12.0) (2022-08-02)


### Bug Fixes

* **RLS_SUPPORTING:** add policy generator, fix & updates RLS ([a2a1b1a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a2a1b1a95ac44ffc396f6b02ca6665028f9a123d))
* **tests:** fix users, notification-preferance ([ed3ca89](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ed3ca89093c12aadad7c98c9a3cfb41841816293))



## [0.11.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.11.0...v0.11.1) (2022-08-01)


### Bug Fixes

* **build:** build issues ([c3ba51c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c3ba51c6724fed83b26e54d3700387033a994e74))
* **discount-priorities:** default priority added ([fc1479e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fc1479ee63adabfee95a3460f28ba5fcdae815fe))
* **multy-tenancy:** set the default company, fix: update quote users & fix: get quote by id ([a78b673](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a78b6733587d77531d49a885b61a29e4822072b2))
* **multy-tenancy:** upload issues and default company from header ([89fb95b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/89fb95bcdf7323d3f9c148577f0ca0e231b29d79))



# [0.11.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.10.2...v0.11.0) (2022-07-29)


### Bug Fixes

* **architecture_issue:** update tests, fix bugs ([bbaefa0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bbaefa021cee10bd426b723d3af6a1ccfe7ef98c))
* **architecture_issue:** updated tests, fixing bugs ([49ae947](https://bitbucket.org/bloodandtreasure/vendori-api/commits/49ae947074dd84b4535b5cd41f06da4ca01a51dd))
* **migrations:** action log migration ([e8daf6f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e8daf6fa37a7beedf388b898b494aee094f15561))
* **migrations:** add missing migrations ([c0bae27](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c0bae2702410db5098d2c09e6d3f175275f8a8bb))
* **migrations:** add missing migrations ([9b32467](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9b32467888f80bc0e41ecce7b4503ae7bb22fb51))
* **quotes and vendos and products:** fix getMany doesnt exists ([39d29c3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/39d29c3c50f31e056a3b0b2a20f399b9524a7be6))
* **quotes and vendos:** join customer ([00b8c50](https://bitbucket.org/bloodandtreasure/vendori-api/commits/00b8c50381f92449ab72c54089e1ed27127a937f))
* **tests, VEN-848, VEN-849:** update tests, fix issues ([0aad035](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0aad0352a785984120f4a6997948d9585f2cd20b))
* **tests+bugs:** fixed all tests ([7fea666](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7fea66626b0fee9e51eacd84c2e3c1f159e6b34a))
* **VEN-678:** defensive check for shading-rules priority update ([1197f60](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1197f60dcaf06f30b8dd6ebe16c61a4ed68b46d3))
* **VEN-696:** update user's hierarchy ([0f81b4f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0f81b4f6438b43e80353f97ef02bc943a7143597))
* **VEN-804:** fix getMany doesn't exist ([cb0976c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cb0976c9f21ff9a93bd8dac65ecb1737df43cf42))
* **VEN-851:** pagination for recently-viewed-quotes-and-vendos ([a49d699](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a49d6995cf7af774c59b6f7cfee01dca7308882d))


### Features

* **fix_arhitecture:** fix issues ([a1249db](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a1249dbcc0547dba03a8587ca72ba9778aace308))
* **tests:** extends tests ([24e0450](https://bitbucket.org/bloodandtreasure/vendori-api/commits/24e0450ebe75079fc2769c5ca8132f81ab9510a2))
* **VEN-735:** add pdf-exporter ([98850ae](https://bitbucket.org/bloodandtreasure/vendori-api/commits/98850ae55ce0fe87a177afb93a22d2966098f673))
* **VEN-735:** add test export pdf ([fc9675a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fc9675aae4ba833183ec0fa1852a89f2deff01c5))



## [0.10.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.10.1...v0.10.2) (2022-07-21)


### Bug Fixes

* **multi-tenancy:** a default company is added ([0ce5fd1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0ce5fd191cdb37768f395f9c74793f0e374673fe))
* **multi-tenancy:** user auth ([b1e34cf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b1e34cfe9c279c243cbe67221a0af097a5374f09))
* **VEN-703:** resolve user correctly ([2d11e4f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2d11e4f1245a01d3096b835e1573d0351c13141f))
* **VEN-788:** automatically approve or transact quotes and vendos ([1512726](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1512726bfa2cd98740559560f7967ccf336bfbd5))


### Features

* **VEN-678:** retroactive update on PUT/DELETE shading rules ([c5c4199](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c5c4199d6630c8fa884e3feee1e5a8df1b119a61))
* **VEN-703:** allow multiple same products for quote products and customer products ([1ae8ddf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1ae8ddfac954223f97228c2e00885aa694b032dc))



## [0.10.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.10.0...v0.10.1) (2022-07-19)


### Bug Fixes

* **env:** missing example ENVs added ([b06624e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b06624e52b76a17693730101aa474afd7077b12d))
* **migrations:** migration repaired - defaults added & already synced columns are removed ([403990c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/403990cf0fb4d6a64af4616fa2caadf3bbe3d342))



# [0.10.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.12...v0.10.0) (2022-07-18)


### Features

* **tests + fix:** add mocking guards, interceptors, fix decorators, add guards ([46b9514](https://bitbucket.org/bloodandtreasure/vendori-api/commits/46b951465326514590513fab20f9e2013fea722d))
* **VEN-427:** add company_id current tenant isolation ([0fbe05d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0fbe05d75175d4bfc28d4725ccbac3ce520d8c2d))
* **VEN-427:** add job connection, add transaction wrapper, add policy generator ([865bb60](https://bitbucket.org/bloodandtreasure/vendori-api/commits/865bb608624d6aee92b9930bf489e647ce10d62f))
* **VEN-427:** add tenants ([cba92ab](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cba92ab31256f2de46efacaade8ed00ab34843a9))
* **VEN-631, VEN-632:** add multytenancy ([840f215](https://bitbucket.org/bloodandtreasure/vendori-api/commits/840f215492e74b8f62dbc8955513d152b1b2ac1a))
* **VEN-634, VEN-808, VEN-756:** mocking subdomain tests ([bb3b315](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bb3b315718656a1f323a05b7489e9044a467ac91))
* **VEN-634:** prepared db configuration ([ac1ff38](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ac1ff38ad972629b28b1a1923f48ddd74b4a2008))
* **VEN-634:** refactor action logs due refactoring manual submit quote/vendos ([99c8829](https://bitbucket.org/bloodandtreasure/vendori-api/commits/99c8829562a4cea4bc17636973b4ae7eb3fc78a0))
* **VEN-756 & VEN-427:** add wrapper for complex multiple methods ([288e734](https://bitbucket.org/bloodandtreasure/vendori-api/commits/288e734495d14c59191bb16f766ecd621119713c))
* **VEN-756:** add inject user ([962a4fb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/962a4fbdee424b25fc1dce4875f3ed082c22ce13))
* **VEN-756:** add injecting to all methods; ([1afa681](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1afa68116c918ace33ee877c0a324dcf1163e20f))



## [0.9.12](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.11...v0.9.12) (2022-07-18)


### Bug Fixes

* **VEN-793:** return only assigned quotes or vendos for Owned/Assigned Only data visibility ([3cb4dd9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3cb4dd92a88a57dd92ba762a150914f2447836b3))



## [0.9.11](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.10...v0.9.11) (2022-07-15)


### Bug Fixes

* **VEN-767:** exclude user's password from GET endpoints ([81f5f4a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/81f5f4a89ec63d2415b99133f4c5a118b3b0d21b))


### Features

* **VEN-700:** set user phone number optional ([653f6c7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/653f6c7b5342e18401189cfe8c52eb6f71982e34))
* **VEN-757:** add quote-and-vendo-uuids for a quote progression input ([ace0c26](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ace0c269dd366d5abcef378a277f86c01191f13b))
* **VEN-794:** clone quote or vendo with the incremental uuid ([be71cc2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/be71cc2bf70dbd49a9bac7e3d3b19a798a6f0b74))
* **VEN-794:** WIP clone quote ([97de209](https://bitbucket.org/bloodandtreasure/vendori-api/commits/97de209c3ff897db21bb433bd81177a0e7b0f84b))



## [0.9.10](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.9...v0.9.10) (2022-07-13)


### Bug Fixes

* **migrations:** relation "UQ_38d194211b55e13e69fbe0371c1" already exists ([46064d0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/46064d0449a9dc37ba040a101a065bb14fa5da1c))
* **VEN-642:** add missing subject for batched email notifications ([5d13905](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d1390599592a683f7677de7636577cb53b83d79))
* **VEN-789:** update the Create to Internal Create role ([aafb335](https://bitbucket.org/bloodandtreasure/vendori-api/commits/aafb335448fbe805bf09fc2ba4f1d352b5876f68))


### Features

* **VEN-642:** send a batched email for quotes and vendos ([27eddd5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/27eddd5321b7bfea81fc0c6738d909c5f666c383))
* **VEN-758:** merge materials in order of materialIds passed from frontend based on quote position ([f43adb8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f43adb8dd4fd20c658405126db942ab27e2a5981))



## [0.9.9](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.8...v0.9.9) (2022-07-06)


### Bug Fixes

* **VEN-797,VEN-798:** reduce the model name for migration issues ([d61f253](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d61f2532465a4530ad236f9d79d09d4be35cff8f))


### Features

* **VEN-797:** setup user notification preferences ([daf4290](https://bitbucket.org/bloodandtreasure/vendori-api/commits/daf4290b15de3537d58bb093d96f740e10e1aaa7))
* **VEN-798,VEN-799:** add migration for notification preference and saved alerts ([0043a56](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0043a5680e791b9defa199b329e456c8cc46cd71))
* **VEN-798:** create saved alerts ([1c8bd76](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1c8bd76e578a3556a84d54be20527e6e7b2faf9c))
* **VEN-799:** create a bulk update endpoint for notifications ([b71f49e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b71f49e2f9cd4bbe9e12a19ef2af0c08ebf48e50))



## [0.9.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.7...v0.9.8) (2022-07-06)


### Bug Fixes

* **action logs:** fix quote products and add a fallback incase there is no company id ([a5c0a11](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a5c0a117c5c7e5017094380fe27bd12317f12791))
* **migrations:** missing migrations for multiple companies and action logs ([24161bf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/24161bfc39b5ddcfc35d0e5ae2bc2a8c0f63f2f6))
* **typo:** use VendoStatusEnum instead ([a7fccc3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a7fccc325cf3977599288be4d2be23ebbd0018a0))



## [0.9.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.6...v0.9.7) (2022-07-05)


### Bug Fixes

* **VEN-796:** fix getting page ([ea56a4f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ea56a4fbc222ef29c537f94953a8fc8384f2ed8d))



## [0.9.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.5...v0.9.6) (2022-07-04)


### Bug Fixes

* **quotes and vendos:** merge issues ([7ecd8c1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7ecd8c125973d77f8c0eb29d30031ad00e74de4d))
* **VEN-755:** fix creating vendo, validation if all approval queues are approved and sending a transacted email ([40c3b37](https://bitbucket.org/bloodandtreasure/vendori-api/commits/40c3b377c6fece9f9bc1087cebc8ee9618477b21))
* **VEN-755:** fix merge issues ([45302af](https://bitbucket.org/bloodandtreasure/vendori-api/commits/45302af00a51a93b77bd061b503250d421275e7b))
* **VEN-755:** fix sending an approved email after merging ([373854a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/373854a970cbd1e28c5d7ac9a9ce15ac9a497793))


### Features

* **VEN-756:** add method decorator for action logs ([e3c2641](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e3c2641a71ba325288ff6f290c035cb3d3df1a68))



## [0.9.5](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.4...v0.9.5) (2022-06-30)


### Bug Fixes

* **quotes and vendos:** add the user id when submitting to the customer ([2078292](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2078292b3c6c343ee1a4f604eb316dd2bf96797b))
* **quotes and vendos:** disable active notifications ([09f610f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/09f610f5142c46ac33edd7973af5dad498dcdf1d))
* **quotes and vendos:** disable resubmission when updating a quote status ([af898ff](https://bitbucket.org/bloodandtreasure/vendori-api/commits/af898ffe34d249abbd8028d1c5438c55714aa384))
* **quotes and vendos:** fixes for the demo from yesterday ([27ee138](https://bitbucket.org/bloodandtreasure/vendori-api/commits/27ee138d63e8eb01ffdb10cbbb7e4226991cd7d5))
* **quotes and vendos:** set the default submission target ([92c2879](https://bitbucket.org/bloodandtreasure/vendori-api/commits/92c2879cf56c32461a3de8bb6c9775a4aff69cbd))
* **typo:** use the quote approval customer, not the quote customer ([9c463af](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9c463af0d9ada3ef05aaa422244a1d007d3d7a84))
* **VEN-755:** do not send the transacted email to the approver(customer) ([6a364f4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6a364f42661ebc40fa829cfdaaca94f96b873154))
* **VEN-763:** resubmit quotes/vendos with auto-approved ([af059c7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/af059c76f1fd2c8ef8a2aab7df42250936d68a49))


### Features

* **VEN-755,VEN-763,VEN-762:** send quote/vendo approval/approved/transacted emails via submit endpoint ([4468214](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4468214997c214f0c412bdd4aabb1cb0903b79a2))
* **VEN-755:** fix resubmission ([0ad2869](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0ad2869171aa8f9211577d5ffc2621a2d105fc25))



## [0.9.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.3...v0.9.4) (2022-06-29)


### Bug Fixes

* **emails:** emails are not resending ([bc81bff](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bc81bff8f39167ec8f934c9ae8d747a574a1eada))
* **emails:** emails are not resending ([5b764fa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5b764fa34364d373f8a82989c0fdb198cac07d98))
* **env:** update the email template ids ([ef44602](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ef44602b89eb5c62b938066fca7d6e8644bc29f9))
* **merge): Revert "fix(quotes and vendos:** ... duplicate approval email methods?" ([5a19cf9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5a19cf9f573389101c214a5e76e891940e836aef))
* **migrations:** migration fixed ([d0fbae8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d0fbae851f9f9a88b6df61c700f4fd591499f174))
* **quotes and vendos:** ... duplicate approval email methods? ([c331071](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c331071c56f4eaa631f774212e6fdd74c0411521))
* **quotes and vendos:** do not prevent sending approval emails based on the status ([6858b21](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6858b211b763262bf547d810dfc66e8c32631579))
* **quotes and vendos:** don't send transaction emails from the consumers / background jobs ([e3e5f1a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e3e5f1a57e6eed6dc17727ac8e1ca9f58b7c0bf2))
* **quotes and vendos:** hierarchy fix ([2d58822](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2d58822a506977ad8c93f4fe4248f1927ea9cee8))
* **quotes and vendos:** set the lock status when marking the entity as approved ([279746d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/279746d99c0e5747a40f3158184af847f06d0de9))
* **seeds:** remove referenced / disabled seeds ([9d117f0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9d117f0eb6bc481e928dc760bad998aff0fbf0c2))
* **VEN-762:** fix submit service ([f7eec6d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f7eec6d6ad8c7a1a08264ef8e25bf39441b3f949))


### Features

* **email:** update approval email template and text ([f93f1c0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f93f1c01096d6265d46b56f705837f2029bf3e59))
* **VEN-755:** remove isApprover condition for internal/external approval queues ([7adc1cb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7adc1cbe6c2b3281bba509849c6e527168a40d8c))
* **VEN-762:** add /submit to vendo ([a6f90e8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a6f90e8647b4ebe5b73429942a08dac633ca37d4))
* **vendos:** add isLocked ([6859fcc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6859fcc7e996f5bb02772c2b6860fc00123f7d14))



## [0.9.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.2...v0.9.3) (2022-06-28)


### Bug Fixes

* **initial-migration:** fix the migration file ([5d72e1e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d72e1e2465184f5ce651e595bd2664be7e8669d))
* **migrations:** set the current db schema as the intial db migration ([d436409](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d436409166d4daaf9815e35764c9429acc2eee97))
* **migrations:** set the current db schema as the intial db migration ([9c6acad](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9c6acad7614b848aecf2aa594f36c8ee12c012a1))
* **quote users:** the wrong user id is added when updating a quote user ([5d678eb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5d678ebdc93bb516b86c4edc31e2887fb36c488b))
* **quotes-and-vendos:** disable sort for now ([ed3eb18](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ed3eb1808c666e0af2ca86ff49d95379bd03c204))
* **quotesAndVendos:** fix join methods ([495733d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/495733d21615ae97f949288259a63ab189094d74))
* **quoteUsers:** cleanup ([986be03](https://bitbucket.org/bloodandtreasure/vendori-api/commits/986be03cfde188b8960b270d8f4d2b19d9e9cacc))
* **redis:** ignore db & cache ([b56ce3a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b56ce3a0d80ce49e215ce16c87143caaa640a343))
* **VEN-701:** fix sameSite: "lax" ([5ef1151](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5ef115134af796c132dadb4d4498ef3c29637847))


### Features

* **VEN-737:** send quote/vendo transacted emails ([dcd5065](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dcd50656eb049e949f31c8b0d4218d45edef652c))
* **VEN-741:** send customer approval emails for quotes and vendos ([7e06f4a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7e06f4af11ef4e9f391b6f93bf8a0d656d77c391))
* **VEN-754:** add Global Search - API ([aec2fc3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/aec2fc3fdda43542e423f2fd00d42b6849a082ec))
* **VEN-761:** add redis health check for bull jobs, add password ([5ff74dc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5ff74dca5ecfaa0d4c54afc020d405735e6c6178))
* **VEN-761:** downgrade the bull to 3.x which is stable ([03fecc1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/03fecc1cbef9104063ad54af17ca1bd2f8e0ce3f))
* **VEN-762:** add control email sending ([cc63a49](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cc63a49925f0a27d9a5a67d6b2255d4297b9f643))
* **vendoContacts:** add isOwner ([b00a2f4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b00a2f40c5dfafcc90d58c3610999e1f01354e23))



## [0.9.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.1...v0.9.2) (2022-06-23)


### Features

* **VEN-709:** send a quote expiry email ([032c928](https://bitbucket.org/bloodandtreasure/vendori-api/commits/032c928fbce7b62f5136f7428583a7f5285b3992))
* **VEN-733:** automatically expire quote/vendo approval queues ([178ca5b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/178ca5b2fcd25c29452fd9b48b87c1383c47729c))
* **VEN-733:** send a vendo expiry email, fix some issues while testing both quotes and vendos ([318b4d9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/318b4d9fbdb80d411ddcd88894d5abe48ffb607c))
* **VEN-744:** apply Auto-Approved status to quote and vendo ([5919a81](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5919a81a68073f3157853d00a51862da0ed573b3))



## [0.9.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.9.0...v0.9.1) (2022-06-23)


### Bug Fixes

* **VEN-568:** Update external user seed data ([e6bbefd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e6bbefd836cac1b643d813db02adf8b7ba5b83ed))
* **VEN-701:** fix sameSite: lax ([0b98861](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0b98861fe356cba5dc06cf8bc5de132f86b5c1a2))
* **VEN-730:** Update product and billing frequency enums ([31cccf3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/31cccf320f644ada66d7039a9ee3a14a4d6f9194))
* **VEN-739:** Remove fussy seed data ([bdb3074](https://bitbucket.org/bloodandtreasure/vendori-api/commits/bdb3074f99cb335f8ab88260870c940114e1ac72))



# [0.9.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.8.1...v0.9.0) (2022-06-20)


### Bug Fixes

* **discounts:** allow for an empty priority ([3662f40](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3662f40fbaa1afc3c721f97b8db30b380c25cd2f))
* **quotes:** do not require comments to be filled in ([6b11c5e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6b11c5ea20cf421663d273cba1f3af7474c389db))
* **users:** allow the geo hierarchy to be inactive (not enabled) ([fea461f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fea461ffd0470b25d280608fefee29ce3fe8196f))
* **VEN-638:** Typo ([17c3f9b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/17c3f9b67ebde79fbd3ff2cf61c99035e5dd0e96))
* **VEN-689:** fix creating a quote with a salesforce opportunity id ([b83507a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b83507ac7c03a53460d8cf766454983f6f67c213))
* **VEN-743:** allow updating quote/vendo status via PATCH ([a763fd2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a763fd2d5f44d3b35f039b726fc1d73f71a9b821))


### Features

* **VEN-638:** Group Endpoints On Swagger By Section ([5474407](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5474407ab2855f090723b9596de10e4dbe9bf042))
* **VEN-654:** add filtering by user attachments ([03e0738](https://bitbucket.org/bloodandtreasure/vendori-api/commits/03e0738fa7aa083a8cf55789d9e550f8f5e8bcd4))
* **VEN-654:** add sub-hierarchy interceptor ([ac71332](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ac713322b6e8920751dcebc8c589275abb9764ff))
* **VEN-686:** return days since submission for quotes and vendos ([f21134d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f21134dcf9a4c45d9c5a226f3a0d88aaf2a48f64))
* **VEN-710:** add demo users during seeds ([31e1709](https://bitbucket.org/bloodandtreasure/vendori-api/commits/31e170988ff3bc4df723e639b814a8c728d1cec5))
* **VEN-734:** update an approval email title and description ([10847a9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/10847a952ed75707a15364cab9e5c206ad00a429))
* **VEN-736, VEN-742:** add geo hierarcy to vendo, refactor quotes-and-vendos for supporting filtering, and pagination ([d6fa61a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d6fa61a4242e9874a6819063386c8771414cf699))
* **VEN-739:** disable isExportRight ([9054939](https://bitbucket.org/bloodandtreasure/vendori-api/commits/90549395c27083d002a6e06c8d3de94218f5b752))
* **VEN-746:** allow updating quote/vendo approval queues by id ([09fffd4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/09fffd411d25a045ac6fde8a5c5989e1e38b76bb))
* **VEN-746:** validate quote/vendo approval queue priority and status, update unit tests ([c047b15](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c047b15fc5ca9f672c6701f2b6305d397a7ecb31))



## [0.8.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.8.0...v0.8.1) (2022-06-16)


### Bug Fixes

* **fallback:** add a fallback when comparing with toString ([d193989](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d1939894672bdc28a97944bfc4e083f3f61cffc0))
* **seeds:** json format ([187e2b8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/187e2b88b4c63e379b830abff497a4b066bb4946))
* **seeds:** json format ([f46128e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f46128ebf995d2041e5aa14cf04932002d1de2bb))
* **VEN-487:** disable materials on delete ([3716469](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3716469e8a53cdb4c6a9748738f7e5627361b0cb))
* **VEN-690:** fix quotes and vendos relations ([2785ae9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2785ae9d84071eec2bc08a865b27ea0be6c5ff66))


### Features

* **VEN-547:** add is active for product-relationships ([25ee1aa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/25ee1aa307c59a61fab220b926f3dba90aad50aa))
* **VEN-558:** add bull-arena dashboard ([cb4205a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cb4205a591819da60db2380515288dd931a04b70))
* **VEN-558:** apply ClassSerializerInterceptor globally instead of controller level ([dcf4905](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dcf4905c0bcb14656d0c16170cf09077018e4af3))
* **VEN-558:** exclude token for quote/vendo approval queue apis ([111e65f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/111e65fe0aec62f70c520af55145d433c2d95fcc))
* **VEN-558:** pass isVendo to change View button title, run approval queues every minute ([62cf1fc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/62cf1fc4f2a33001995c01b4a6e312a9c7a28781))
* **VEN-558:** send approval emails in background ([e801987](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e801987fa0b9b8488cd478a50035085ac5cb6026))
* **VEN-558:** send vendo approval emails ([e01bad2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e01bad2991a93c3889213f91cc9a3899b4606694))
* **VEN-640:** retroactive update for approval queue priorities ([f8d1667](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f8d166766bf7d54a0de039179a738cd8e01bfb0b))
* **VEN-657:** account for vacation-rules when sending approval emails ([58a40c0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/58a40c0dc7b57031999774269b930b3704a4a196))
* **VEN-675:** add retroactively priority decorator ([41f6780](https://bitbucket.org/bloodandtreasure/vendori-api/commits/41f6780b5168ea73a9a437fdcc2864f5856b9c91))
* **VEN-675:** add retroactively priority endpoint ([484a714](https://bitbucket.org/bloodandtreasure/vendori-api/commits/484a7149df6b9428821c9173c51eb579577c8c41))
* **VEN-708:** update notification type enum to include missing templates ([708768d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/708768dff74d22ff9ae1ebcfdb55a9ffffa0cc67))



# [0.8.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.7.0...v0.8.0) (2022-06-13)


### Bug Fixes

* **VEN-450:** retroactive update for shading rules ([c15d98d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c15d98d7ebc1c76dbe0f027e06fb2949fee9902f))
* **VEN-548:** omit sourceProductId and targetProductId from PATCH ([67ee668](https://bitbucket.org/bloodandtreasure/vendori-api/commits/67ee668df65bb7e41efb12ffe59359f6d9e5dc98))


### Features

* **VEN-493:** add workflow rule validator ([ae93666](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ae93666be4bcbd994b75c424abe2e4d4f0cb9eb9))
* **VEN-493:** update workflow config ([3c63b11](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3c63b11552fd5a70e84a2541d02468463b79a429))
* **VEN-672:** add catchall workflow ([0c4661c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0c4661c057ee7c10b36d6e2019177aac6c081293))
* **VEN-674:** refactor discount-list-prices ([5f1eb78](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5f1eb785015fa5277493e5601678e92ecedf9c72))
* **VEN-676:** add settings ([1e3748b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1e3748bb3713fbc184fbb65c41870ffbcea1ae33))
* **VEN-690:** add customer and owner to quotes and vendos requests, fix offset ([be62e4c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/be62e4ca838dad8fc1bb6767405604832d5ecd09))
* **VEN-691:** Return a 200 status code ([c9f7452](https://bitbucket.org/bloodandtreasure/vendori-api/commits/c9f74521402327a1438cc18afdf6539c3b7193ee))



# [0.7.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.6.0...v0.7.0) (2022-06-08)


### Features

* **VEN-493:** add workflow rule logic validation ([fbf7d59](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fbf7d590e52685b72722ec582c1c8fd7c6d3b4cf))
* **VEN-533:** add recently viewed quotes vendos ([6fa7bb4](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6fa7bb44e48eb1bbe4161f657ecf85d279e4b8af))
* **VEN-659:** add quotes and vendos ([80b5d4c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/80b5d4cb0547f34d142a4b48070610ef09846b3e))



# [0.6.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.5.0...v0.6.0) (2022-06-02)


### Bug Fixes

* **discount rule:** add owner user ([98e95bf](https://bitbucket.org/bloodandtreasure/vendori-api/commits/98e95bfa6f3e114e29cc0dfe5e819ca1df914a97))
* **VEN-490:** disable uniue priority for sahding rule ([b650a03](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b650a033961ef6024d1256d8e24cc41e4c9aff60))
* **VEN-595:** fix updating quote approval queue ([e248435](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e2484350eb74f897794ca4c9fb05c5af2bbca6af))
* **VEN-595:** update quote approval queues on quotes users update ([076f417](https://bitbucket.org/bloodandtreasure/vendori-api/commits/076f417504f126edd7e327cd4c23430e97c9692d))


### Features

* **VEN-595:** reset other quote approval queues on resubmission and rejection ([dda6ac1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dda6ac14c9c437edcbdf1f891e9566669c21626d))
* **VEN-595:** update the logic to reject/resubmit a quote ([10e70e0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/10e70e0b62cb125a1d6ff6d9936c4bcc416c1249))
* **VEN-620,VEN-621,VEN-622,VEN-623:** implement vendo approval queues ([0e66cf9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0e66cf9687e00094f40c923077f62f124d131efe))



# [0.5.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.14...v0.5.0) (2022-05-30)


### Bug Fixes

* **VEN-548:** fix patch product-transitions ([9c37d53](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9c37d53078b63786cecde7ce6d4c72ed435d50ac))


### Features

* **hierarchy:** add geo, product validations ([3345173](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3345173f755337149d5a86662e19af342db60c56))
* **update_okta:** add frontend redirect ([6074e7b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6074e7bdeb641a05dc5d73826998dea313b43d74))
* **update_okta:** add logout ([42228c1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/42228c135238822bca090de84cb360e0f38115e7))
* **VEN-573:** add seeds for hierarchies, company-address ([500ae9d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/500ae9d97c86a34e4a7762af415bddaa51aa8efc))
* **VEN-595,VEN-617,VEN-618:** implement quote approval queue ([defba05](https://bitbucket.org/bloodandtreasure/vendori-api/commits/defba056ad7b1140e22fc3e72d84346af1eb4e5e))
* **VEN-595:** create/update approval queue priorities, quote approval queues ([856c5ba](https://bitbucket.org/bloodandtreasure/vendori-api/commits/856c5ba54c189eaa7914d2bb12e27b0074de7463))
* **VEN-595:** disable updating quote status directly b/c it should be updated via quote approval queue ([205f794](https://bitbucket.org/bloodandtreasure/vendori-api/commits/205f794db508f04d9c0127d51b0de47e33d57c84))



## [0.4.14](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.13...v0.4.14) (2022-05-27)


### Bug Fixes

* **VEN-573:** fix priority ([1234b34](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1234b34306564e0ad3b2297331225f3dc57d0368))


### Features

* **pre-commit:** disable unit tests on pre-commit ([a25e3fa](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a25e3facc79236d7e24a95598dd4667e275b8189))
* **VEN-487:** keep deleted materials ([b794cf6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/b794cf6258fbe7dc49133acc29eb0561cb6c3801))
* **VEN-492:** create approval-queue-priority ([89dfa36](https://bitbucket.org/bloodandtreasure/vendori-api/commits/89dfa36d917198374f687076914dc1c29702ad33))
* **VEN-492:** create approvalQueuePriority automatically when creating a role ([48e709b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/48e709b8c8244f01a51508a7616c410330de78c5))
* **VEN-575:** add startDate/endDate to quote product ([d7c7a57](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d7c7a576ccd223cc0a88d6d1bec70240f8a79b10))
* **VEN-580:** add discounts priorities ([209921b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/209921bc5b23972141c18d32b2edc0da97784546))
* **VEN-581:** Replace incremental with tiered ([3b518c5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3b518c52647727a08279be17526705aa3c4fe091))
* **VEN-597:** revert removing priority from oem_roles, update approval_queue_priority ([670a151](https://bitbucket.org/bloodandtreasure/vendori-api/commits/670a151e6846fae99c60cedfd1f6672ddf450da7))
* **VEN-598:** create DELETE /vacation_rules endpoint ([fd5f213](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fd5f213cca6c8df45e28c4731ec7ecfe7714b502))



## [0.4.13](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.12...v0.4.13) (2022-05-24)


### Features

* **VEN-581:** Pricing Model - Update the type enum ([9e2dfc6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9e2dfc634ba713f0f4ea6b3f29623ab2fe434c82))



## [0.4.12](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.11...v0.4.12) (2022-05-24)


### Bug Fixes

* **VEN-575:** adjust term length for products ([2051a1e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2051a1e2a2f763fc59f7bf1a7de02ad427108b61))



## [0.4.11](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.10...v0.4.11) (2022-05-24)


### Bug Fixes

* **GEO_HIERARCY:** fix clause for geo hierarchy ([89e5479](https://bitbucket.org/bloodandtreasure/vendori-api/commits/89e5479f9b2d31652f588707202f521c81895d65))


### Features

* **CD-240:** add typeorm subscriber, event emitter to send emails for vacation rules ([ea4d943](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ea4d9436599fdeabc052d7e1f5be49b43a602502))
* **VEN-240:** add validation for targetUserId to be different with sourceUserId for vacation-rules ([5ccf680](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5ccf680cc7a2aae48bfd04f9195f6bc1dc7e398c))
* **VEN-240:** create vacation-rules endpoints ([606a5f0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/606a5f0a911d9340d4dfa985ae169ba90a3280d5))
* **VEN-240:** disable put/delete endpoints for vacation rules ([5135224](https://bitbucket.org/bloodandtreasure/vendori-api/commits/51352244fdde824d92887e0f68062c8dbdec97bb))
* **VEN-240:** integrate sendgrid dynamic template ([7dbb5bb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7dbb5bbd76b877a73ccab781493da4fa4c9cd6a8))
* **VEN-515:** create a notification table, REST endpoints, tests ([5506e97](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5506e9744de328c03200e13ff087c8530358ada4))
* **VEN-515:** record sendgrid status ([dcd1fda](https://bitbucket.org/bloodandtreasure/vendori-api/commits/dcd1fda57bd2adb5161360d4746b0ebb0cd82498))
* **VEN-574:** add email to address ([182cbe5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/182cbe5b821d6a32536493bb5d4757abf48fd689))



## [0.4.10](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.9...v0.4.10) (2022-05-24)


### Features

* **VEN-518:** add controller/dto/factories to dicount relation entity ([0d8017d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0d8017df0e2bad54a27e021ada1c875c20bffdd6))
* **VEN-518:** add discount entities ([8ab3c3e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8ab3c3ee9424a931bb39604d3323d535202be7a8))
* **VEN-519, VEN-518:** add tests, add seeds, add controllers ([43c8a92](https://bitbucket.org/bloodandtreasure/vendori-api/commits/43c8a92e50e0b73cd601fd805ea45dae055043b0))
* **VEN-520:** filter resources based on active / inactive ([cc98460](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cc98460eca2612583113c6bcdb1e81ceac789601))
* **VEN-531:** add is_active to hierarchy_levels ([64338f0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/64338f05a8b00205c29f0922a98bb3bfeea499b6))



## [0.4.9-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.7-prod...v0.4.9-prod) (2022-05-17)


### Bug Fixes

* **oem_company_factory:** fix image faker ([a68254e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a68254e663fc57e90fa4a23afe0a12cf1cbdcfa5))


### Features

* **VEN-436:** add is_active to hierarchies ([96ebb4d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/96ebb4dc21933816d920cf7ff18e539438f6ec3c))



## [0.4.8-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.7-prod...v0.4.8-prod) (2022-05-17)


### Bug Fixes

* **oem_company_factory:** fix image faker ([a68254e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a68254e663fc57e90fa4a23afe0a12cf1cbdcfa5))


### Features

* **VEN-436:** add is_active to hierarchies ([96ebb4d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/96ebb4dc21933816d920cf7ff18e539438f6ec3c))



## [0.4.8-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.7-prod...v0.4.8-prod) (2022-05-17)


### Bug Fixes

* **oem_company_factory:** fix image faker ([a68254e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a68254e663fc57e90fa4a23afe0a12cf1cbdcfa5))


### Features

* **VEN-436:** add is_active to hierarchies ([96ebb4d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/96ebb4dc21933816d920cf7ff18e539438f6ec3c))



## [0.4.8-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.7-prod...v0.4.8-prod) (2022-05-17)


### Features

* **VEN-436:** add is_active to hierarchies ([96ebb4d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/96ebb4dc21933816d920cf7ff18e539438f6ec3c))



## [0.4.7-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.5-prod...v0.4.7-prod) (2022-05-12)


### Bug Fixes

* **seeds:** remove verb generator for products - problematic test names ([0429ca8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0429ca8d71da5160fa834b5c8b7be4f1c280c9a1))
* **VEN-478:** fix create/update price tiers ([1a0b2c6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1a0b2c67be78d28599f7103ab4a54a7cfd8e25c4))
* **VEN-479:** fix create/update roles ([1dab10c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1dab10ceae042e6716c17c90abf60fb7be9ea304))
* **VEN-481, VEN-482:** fix merge issue, refactored app module config ([e142600](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e14260098529dbfeb68018f29c148856ffd28d81))


### Features

* **VEN-424:** Product Pricing Updates [#2](https://bitbucket.org/bloodandtreasure/vendori-api/issues/2) ([53dee16](https://bitbucket.org/bloodandtreasure/vendori-api/commits/53dee16d698fe60a6e03dc252feef682ab6716a3))
* **VEN-428:** Add is_full_list_price and is_incremental for product transitions ([7c64cc0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7c64cc05530216f3860cde0f89b39070aefc1fa2))
* **VEN-428:** Validation Fixes ([5950133](https://bitbucket.org/bloodandtreasure/vendori-api/commits/595013320a07fbdd780e4765f7c8708863ecccc4))
* **VEN-431:** Add is-billing and is-shipping to oem addresses ([10367a0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/10367a039e693f368f58ef6143ebf43f8756ad85))
* **VEN-433:** add function_type enum to oem_roles ([772a556](https://bitbucket.org/bloodandtreasure/vendori-api/commits/772a556c38493f4950349ff70e31661deb8870f5))
* **VEN-457:** make unit tier end range nullable ([6befafb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6befafbcbe75f74829935ba6525165f94015676b))
* **VEN-458:** add is_owner boolean to quote contacts ([67d8ee3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/67d8ee391831e3f7bd8a2cf3b880cb2cdcc6dfe0))
* **VEN-459:** add a simple join for pricing model, nested join for price tiers ([4d2802a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4d2802a3fbb1f943ec85570818052107497d17c1))
* **VEN-470:** Model Pricing - Fix enumerations ([3572bb2](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3572bb29ec69d31374b09c57e6795c2a0a6c6858))
* **VEN-480:** allow joining a product at the quote products endpoint ([ede1c7c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ede1c7cf5ace35f0fc56348601fb66067a282e46))



## [0.4.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.5...v0.4.6) (2022-05-11)


### Bug Fixes

* **VEN-478:** fix create/update price tiers ([1a0b2c6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1a0b2c67be78d28599f7103ab4a54a7cfd8e25c4))
* **VEN-479:** fix create/update roles ([1dab10c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1dab10ceae042e6716c17c90abf60fb7be9ea304))


### Features

* **VEN-480:** allow joining a product at the quote products endpoint ([ede1c7c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ede1c7cf5ace35f0fc56348601fb66067a282e46))



## [0.4.5-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.3-prod...v0.4.5-prod) (2022-05-11)


### Features

* **VEN-465, VEN-366:** update relationships, fix tests, refactor okta ([55873ba](https://bitbucket.org/bloodandtreasure/vendori-api/commits/55873ba46db109f46323fc16c9c3faa87a7702d7))
* **VEN-476, VEN-477:** make fields optionals ([eab221f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eab221f503c17b21fbe9f5b10165f6567223f899))



## [0.4.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.3-prod...v0.4.4) (2022-05-11)


### Features

* **VEN-465, VEN-366:** update relationships, fix tests, refactor okta ([55873ba](https://bitbucket.org/bloodandtreasure/vendori-api/commits/55873ba46db109f46323fc16c9c3faa87a7702d7))



## [0.4.3-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.2-prod...v0.4.3-prod) (2022-05-06)


### Features

* **VEN-393:** allow company to be created ([2995416](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2995416a337c44f071780d9a930ce761c4cdfcc5))



## [0.4.2-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.4.0-prod...v0.4.2-prod) (2022-05-06)


### Bug Fixes

* **VEN-424:** add model_type ([cf97016](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cf97016ac0c44b9e8af8c1f33afe94fb7d368e21))
* **VEN-437:** add parentId in seeds ([e9ac62d](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e9ac62dac77576ab23744ad6ec790011add75dc2))


### Features

* **VEN-430, VEN-432:** remove stringification, add get all transactions ([28a09e7](https://bitbucket.org/bloodandtreasure/vendori-api/commits/28a09e793ff3075367dccfc06f8dd9d91123c76b))
* **VEN-437:** add parentId ([50ee00e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/50ee00e08b607c77410f7c14adf2b6c1c60f45f9))



# [0.4.0-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.9-prod...v0.4.0-prod) (2022-05-04)


### Features

* **VEN-324:** add new seeds ([e857a76](https://bitbucket.org/bloodandtreasure/vendori-api/commits/e857a761efaa79e01e4ddea349e95629fb942de3))
* **VEN-424:** add enums for pricing model, add shading-rule priority checker ([1b5dc07](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1b5dc0720c0fedf817f504289bf4ec337ed0c461))



## [0.3.9-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.8...v0.3.9-prod) (2022-04-29)



## [0.3.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.7-a-prod...v0.3.8) (2022-04-28)


### Features

* **VEN-365:** frontend fixes ([3b808f9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3b808f9555a39e5ed33f9c1d6f81eac2e296a7bd))



## [0.3.7-a-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.7...v0.3.7-a-prod) (2022-04-25)


### Bug Fixes

* **VEN-365:** frontend requets [#2](https://bitbucket.org/bloodandtreasure/vendori-api/issues/2) ([70efc09](https://bitbucket.org/bloodandtreasure/vendori-api/commits/70efc095b6de80980f849763fc08c4037b74b7b7))



## [0.3.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.6-prod...v0.3.7) (2022-04-24)


### Bug Fixes

* **VEN-345:** frontend changes requests ([2dedb04](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2dedb047a14a4368768b3791f210acee16616665))



## [0.3.6-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.5-a-prod...v0.3.6-prod) (2022-04-19)


### Features

* **VEN-298:** add workflow entity, fixes ([9e983ef](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9e983ef9a2cf41d7b94e3a098780c8b1978151a0))



## [0.3.5-a-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.5-prod...v0.3.5-a-prod) (2022-04-15)


### Features

* **seed:** add quote product, quote materials seeds ([8b0bf77](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8b0bf77af4cced7170b06d7cb4c7bfa897becb18))



## [0.3.5-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.4-b-prod...v0.3.5-prod) (2022-04-15)


### Bug Fixes

* **validation, salesforce:** add licensing program set by default; phone contact disable ([4d0c82a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4d0c82a137170fbe390033be0a5ba08cfcebdb99))



## [0.3.4-b-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.4-a-prod...v0.3.4-b-prod) (2022-04-13)


### Bug Fixes

* **VEN-233:** add multiple quote products, add user quote types ([6cf4579](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6cf457968f2885bfea28adaa0557e8d57d882b05))



## [0.3.4-a-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.4-prod...v0.3.4-a-prod) (2022-04-13)


### Bug Fixes

* **dto:** fix isAddonable field in Product ([1826b8f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1826b8ff1bf52171597182bfb68a2d035a531ab4))
* **s3, join:** add s3 expries, add pricing model join ([1f56f94](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1f56f949b9058bb7a651594e7a620f2f748feff7))



## [0.3.4-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.3-prod...v0.3.4-prod) (2022-04-12)


### Bug Fixes

* **test:** fix tests by adding pricing model seeds ([1c28ad3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1c28ad37cef953c461d0637d4a8da85cb250da3d))


### Features

* **VEN-244:** add pdf-merger ([1878836](https://bitbucket.org/bloodandtreasure/vendori-api/commits/187883690e591009012fa0b355c884690a12aa8b))
* **VEN-244:** add uploading to s3 merged pdf and save it to quote ([944016f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/944016f2c98680971b730bc8ec3a961a90ae6444))



## [0.3.3-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.2-prod...v0.3.3-prod) (2022-04-07)


### Bug Fixes

* **change DTO:** desabled quotes/vendoComments requirements, add default values customer/net prices; ([ae93902](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ae939023ad3621d93a9ebd11e4fcb89ff53580d7))


### Features

* **VEN-296, VEN-295:** add price_tiers DTO/TEST, add pricing_models DTO/TEST ([199b9c1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/199b9c1b64764ace3cf0c929ff4ccd3da20b42af))
* **VEN-296, VEN-295:** add pricing model, add price tiers ([15cf88a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/15cf88ac479aa5d59e7999223d3782d7e6476584))



## [0.3.2-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.1-prod...v0.3.2-prod) (2022-04-05)



## [0.3.1-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.3.0-prod...v0.3.1-prod) (2022-04-04)



# [0.3.0-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.9-b-prod...v0.3.0-prod) (2022-04-01)



# [0.3.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.9-b-prod...v0.3.0) (2022-04-01)



## [0.2.9-b-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.9-a-prod...v0.2.9-b-prod) (2022-04-01)


### Bug Fixes

* **JOINS:** fix joins in bridge tables ([197b164](https://bitbucket.org/bloodandtreasure/vendori-api/commits/197b164f5183f9de9cb95d369a0ea42f4f763a23))



## [0.2.9-a-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.9-prod...v0.2.9-a-prod) (2022-04-01)


### Bug Fixes

* **QUOTE_CONTACT:** fix auto generated keys ([eb40b0c](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eb40b0c8ec281c00e047a437657aac220948a45e))
* **QUOTE_CONTACT:** fix auto generated keys ([9d01cf1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9d01cf19608c731fe573c820bb41aaf083a8f459))



## [0.2.9-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.8-prod...v0.2.9-prod) (2022-04-01)


### Features

* **VEN-289, SEED:** add deal parters, hierarchy, hierarchy-levels, licensing program SEEDS ([6e76a15](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6e76a1590d3949c2139409f856a826eea7932f76))



## [0.2.8-prod](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.8...v0.2.8-prod) (2022-03-31)


### Features

* **VEN-289, VEN-231:** add deal partner module, add contact factory ([abbb1dc](https://bitbucket.org/bloodandtreasure/vendori-api/commits/abbb1dc468aabb2582fff586d6b9b03ea4c4b7e6))



## [0.2.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.7...v0.2.8) (2022-03-30)


### Bug Fixes

* **DTO:** oem-hierarchies ([f04ee1f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f04ee1f5eb3583eb7f86610a14b4191d2f4cd29b))


### Features

* **DTO:** fix string/number issue in position fields ([7ecfae1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7ecfae1a372c8c4dcbd08dc8b8e201562059640f))
* **VEN-236, VEN-289:** add hierarchy, licensing program dto, deal partners entity ([6774970](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6774970a453a16dbf15d66f7292f394d398d41bb))



## [0.2.7-b](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.7...v0.2.7-b) (2022-03-30)


### Features

* **DTO:** fix string/number issue in position fields ([7ecfae1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/7ecfae1a372c8c4dcbd08dc8b8e201562059640f))



## [0.2.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.6...v0.2.7) (2022-03-30)


### Features

* **VEN-235, VEN-236, VEN-237:** add hierarchies, hierarchy-levels endpoints, add licensing-program ([0cea0e3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/0cea0e3fc5ac6e828ff6737e3c0f107606cfe678))



## [0.2.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.5...v0.2.6) (2022-03-26)


### Features

* **VEN-238, VEN-239:** add shading rule controller, service, module ([4fdcebb](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4fdcebbce0f4319e5bc31db2f1edb8723bd447c3))



## [0.2.5](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v2.3.4...v0.2.5) (2022-03-24)


### Bug Fixes

* **quote&vendos:** disable pdf, excel validation, fix dto ([2c62eb5](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2c62eb59a49903c3c67199162b4f660ccdd6ad6d))


### Features

* **239:** add sahding-rule ([555e68f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/555e68f8ec6ca8b7e0600eb017122959beb51aae))
* **VEN-232:** add product-relationship ([aa705d3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/aa705d3284908e384db73b13f6d374c1d1ba7680))



## [0.3.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v2.3.4...v0.3.4) (2022-03-24)



## [2.3.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.3...v2.3.4) (2022-03-24)


### Features

* **VEN-230, VEN-232:** add endpoints vendo & materials, quote & materials, products relationship ([9a55201](https://bitbucket.org/bloodandtreasure/vendori-api/commits/9a552016a25c40ed59b793ae9b4cd5c1583753d2))



## [0.2.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.2...v0.2.3) (2022-03-22)


### Features

* **VEN-230:** add materials ([123b5d0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/123b5d0551a272712e901eb159a81c761202ac1b))



## [0.2.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.1...v0.2.2) (2022-03-21)


### Bug Fixes

* **VEN-229:** add nested join customer.address ([eb3e49b](https://bitbucket.org/bloodandtreasure/vendori-api/commits/eb3e49b41fdfbad18de2300e9164ddc084f8c445))


### Features

* **VEN-236:** add quote vendo contacts ([3c87427](https://bitbucket.org/bloodandtreasure/vendori-api/commits/3c8742766f79c0eb385824745d05599e5740f150))



## [0.2.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.2.0...v0.2.1) (2022-03-20)


### Features

* **VEN-228:** add product vendos; ([cf69838](https://bitbucket.org/bloodandtreasure/vendori-api/commits/cf69838638cb0222c7797b20299c8b018434e3e0))
* **VEN-231:** add contact entity; add users tests; fix users delete; ([87b45c3](https://bitbucket.org/bloodandtreasure/vendori-api/commits/87b45c349c2d0814b346bb4bb4e30863f38894dc))



# [0.2.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.9...v0.2.0) (2022-03-18)


### Features

* **VEN-229:** add vendo-users; add quote-users; add join supports method ([ff6523f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ff6523fd653d61f6e5309bb9c0803bbec12256b3))



## [0.1.9](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.8...v0.1.9) (2022-03-17)


### Features

* **VEN-146:** add customer & opportunity integration ([671c770](https://bitbucket.org/bloodandtreasure/vendori-api/commits/671c770c59d735ffe8b652d5d21a433a3921c93d))



## [0.1.8](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.7...v0.1.8) (2022-03-16)


### Features

* **VEN-146, VEN-228:** add salesforce oauth, add product factory ([77bac72](https://bitbucket.org/bloodandtreasure/vendori-api/commits/77bac72c1a99cee43bf3ed1de653bbf6f4747e87))



## [0.1.7](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.6...v0.1.7) (2022-03-15)


### Bug Fixes

* **VEN-171:** fix bucket, changed .env.example ([6d3e6d1](https://bitbucket.org/bloodandtreasure/vendori-api/commits/6d3e6d17771ca5dc467feb58339c03715753a944))


### Features

* **VEN-229, VEN-228:** add customers, add products ([2a754a0](https://bitbucket.org/bloodandtreasure/vendori-api/commits/2a754a05b3d63e841db159273906581b5b6f977a))



## [0.1.6](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.5...v0.1.6) (2022-03-14)


### Features

* **VEN-205, VEN-206:** add customer factory, add vendo factory ([5141edd](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5141edd5a36188701cea6efbf967ea62f134f83f))
* **VEN-205, VEN-206:** add vendo/quotes seed, add addresses seed, add new faker ([fbc793f](https://bitbucket.org/bloodandtreasure/vendori-api/commits/fbc793ff9b19c5e85ddcfd040d3779005e98e38b))



## [0.1.5](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.4...v0.1.5) (2022-03-12)


### Bug Fixes

* **VEN-170:** remove uudid folder ([930c1d6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/930c1d636db65b17f43bfb480d34e16f46fd3d5d))


### Features

* **VEN-171:** add s3 uploader ([915f344](https://bitbucket.org/bloodandtreasure/vendori-api/commits/915f344d839bacb81428be73d51292593333d8ee))
* **VEN-205, VEN-206:** add quote & vendo dto ([ad5dff6](https://bitbucket.org/bloodandtreasure/vendori-api/commits/ad5dff644e2369a9c35bc2582d39e5f515eb8a91))
* **VEN-205, VEN-206:** add vendo & quotes endpoints ([5b5eb50](https://bitbucket.org/bloodandtreasure/vendori-api/commits/5b5eb5044fc6164b9e48d183903adb31631d0007))
* **VEN-206:** add vendo & quotes ([a16d47e](https://bitbucket.org/bloodandtreasure/vendori-api/commits/a16d47e4c66ee26adadfaf607d9b22adc29794a8))



## [0.1.4](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.3...v0.1.4) (2022-02-21)

## [0.1.3](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.2...v0.1.3) (2022-02-19)

### Bug Fixes

* **sessions:** add setup script ([1db9459](https://bitbucket.org/bloodandtreasure/vendori-api/commits/1db94598628b2cb9f7412953f87c708982e6e7ff))
* **sessions:** fix getting user/me ([32ecade](https://bitbucket.org/bloodandtreasure/vendori-api/commits/32ecade09697689482787aabc2dc409032be326d))
* **VEN-170:** fix company controller ([f6264e8](https://bitbucket.org/bloodandtreasure/vendori-api/commits/f6264e84ac906ff4ce2f0afe8a001a5482072d31))



## [0.1.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.1...v0.1.2) (2022-02-17)


### Features

* **VEN-170:** add user-roles seeding ([4eea147](https://bitbucket.org/bloodandtreasure/vendori-api/commits/4eea1475db10d99722b3892732d24341110bf4ee))



## [0.1.1](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.1.0...v0.1.1) (2022-02-16)


### Features

* **VEN-170:** add okta login ([d277cb9](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d277cb9031846958c8fc11fc8ed4b3a315f53b62))
* **VEN-170:** add okta strategy ([adb1511](https://bitbucket.org/bloodandtreasure/vendori-api/commits/adb151113b9eca7476bc1a2ea4856912a39c0505))



# [0.1.0](https://bitbucket.org/bloodandtreasure/vendori-api/compare/v0.0.2...v0.1.0) (2022-02-14)
>>>>>>> 464ff4665c8a52cbfde3e490a23acc627cce0f90


### Features

* **VEN-168:** add user, roles endpoints ([8270c5a](https://bitbucket.org/bloodandtreasure/vendori-api/commits/8270c5aefc6e7b95e4303da49346ec2ba50f2050))



## [0.0.2](https://bitbucket.org/bloodandtreasure/vendori-api/compare/0.0.1...0.0.2) (2022-02-14)


### Features

* **VEN-168:** add response interceptor ([d085849](https://bitbucket.org/bloodandtreasure/vendori-api/commits/d085849d1e92379f2aa2548ffde2c3d9ab621621))
* **VEN-168:** add seeds ([4967659](https://bitbucket.org/bloodandtreasure/vendori-api/commits/496765961be3c378a259c6a10cdc7f3761ef96ff))



