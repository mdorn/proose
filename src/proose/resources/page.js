importClass(com.mongodb.rhino.JSON)
document.execute('goose/')

function handleInit(conversation) {
    conversation.addMediaTypeByName('text/html')
    conversation.addMediaTypeByName('application/json')
}

function handleGet(conversation) {
    // return 501 // not implemented
    uri = "http://threecrickets.com/prudence/legal/"
    var goose = new Goose.Extractor()
    var result = goose.extract(uri, 'en', 'fr')
    return JSON.to(result, true)
}

function handlePost(conversation) {
    // Example usage:
    // ## Get article title and body:
    // curl -i -H "Accept: application/json" -X POST \
    //    -d '{"uri": "http://threecrickets.com/prudence/rest/"}' http://localhost:8080/proose/page/
    // ## Get translation of an article from English into French:
    // curl -i -H "Accept: application/json" -X POST \
    //    -d '{"uri": "http://threecrickets.com/prudence/legal/", "source_language": "en", "target_language": "fr"}' \
    //    http://localhost:8080/proose/page/
    var text = conversation.entity.text
    var json = JSON.from(String(text))
    var uri = json.uri
    var srclang = json.source_language || null
    var tlang = json.target_language || null
    var goose = new Goose.Extractor()
    var result = goose.extract(uri, srclang, tlang)
    if (!result) {
        return 404
    } else {
        return JSON.to(result, true)
    }
}
