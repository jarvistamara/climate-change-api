const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require('express')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk'
    },
    {
        name: 'post',
        address: 'https://nypost.com/',
        base: ''
    }, {
        name: 'dailynews',
        address: 'https://www.nydailynews.com/',
        base: ''
    }, {
        name: 'washingtonpost',
        address: 'https://www.washingtonpost.com/',
        base: ''
    }, {
        name: 'usatoday',
        address: 'https://www.usatoday.com/',
        base: ''
    }, {
        name: 'chicagotribune',
        address: 'https://www.chicagotribune.com/',
        base: ''
    }, {
        name: 'azcentral',
        address: 'https://www.azcentral.com/',
        base: ''
    }, {
        name: 'houstoncronicles',
        address: 'https://www.houstonchronicle.com/',
        base: ''
    }, {
        name: 'airspace',
        address: 'https://www.airspacemag.com/',
        base: ''
    }, {
        name: 'cnn',
        address: 'https://www.cnn.com/',
        base: ''
    }, {
        name: 'unnews',
        address: 'https://news.un.org/',
        base: ''
    }, {
        name: 'nasa',
        address: 'https://climate.nasa.gov/',
        base: 'https://climate.nasa.gov'
    }, {
        name: 'bbc',
        address: 'https://www.bbc.com/',
        base: ''
    }, {
        name: 'cbsnews',
        address: 'https://www.cbsnews.com/',
        base: ''
    }, {
        name: 'newscientist',
        address: 'https://www.newscientist.com/',
        base: ''
    }, {
        name: 'cnbc',
        address: 'https://www.cnbc.com/',
        base: ''
    }, {
        name: 'apnews',
        address: 'https://apnews.com/',
        base: ''
    }, {
        name: 'nbcnews',
        address: 'https://www.nbcnews.com/',
        base: ''
    }, {
        name: 'usnews',
        address: 'https://www.usnews.com/',
        base: ''
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address).then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })
    })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address

    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress).then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const specificArticles = []

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            specificArticles.push({
                title,
                url: newspaperBase + url,
                source: newspaperId
            })
        })
        res.json(specificArticles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
