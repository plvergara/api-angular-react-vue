require('../config/db.config')

const User = require('../models/user.model')
const Article = require('../models/article.model')

const faker = require('faker')

Promise.all([
    User.deleteMany(),
    Article.deleteMany()
])



    .then(() => {
        const gudurix = new User({
            userName: "gudurix",
            name: "Pedro Luis Vergara",
            email: "pedro@pedro2.es",
            password: "12345678",
        })
        gudurix.save()
            .then(gudurix => {
                console.log(gudurix.userName, gudurix.name, gudurix.email, gudurix.password)
                for (let i = 0; i < 2; i++) {
                    const article = new Article({
                        title: faker.lorem.sentence(),
                        body: faker.lorem.paragraphs(5),
                        image: faker.image.image(),
                        user: gudurix.id

                    })
                    article.save()
                        .then(article => {
                            console.log(article.title)
                        })
                        .catch(console.error)
                }
            })
            .catch(console.error)
        for (let i = 0; i < 4; i++) {
            const user = new User({
                userName: faker.internet.userName(),
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: "12345678",
            })
            user.save()
                .then(user => {
                    console.log(user.userName, user.name, user.email, user.password)
                    for (let i = 0; i < 2; i++) {
                        const article = new Article({
                            title: faker.lorem.sentence(),
                            body: faker.lorem.paragraphs(5),
                            image: faker.image.image(),
                            user: user.id

                        })
                        article.save()
                            .then(article => {
                                console.log(article.title)
                            })
                            .catch(console.error)
                    }
                })
                .catch(console.error)
        }
    })