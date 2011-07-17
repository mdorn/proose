importClass(com.jimplush.goose.Configuration, com.jimplush.goose.ContentExtractor)
importClass(org.apache.commons.lang.StringEscapeUtils)
try {
    importClass(com.google.api.translate.Language)
    importClass(com.google.api.translate.Translate)
} catch(error) {
    application.logger.warning("Google Translate Java API not found: Translation feature unavailable.")
}
document.execute('register/')

var Goose = Goose || function() {
    var Public = {
        config: null,
        extractor: null,
        Extractor: function() {
            this.extract = function(uri, srclang, tlang) {
                try {
                    // use Goose to extract article title and main text
                    var article = Public.extractor.extractContent(String(uri))
                    retval = {
                        "title": String(article.getTitle()), 
                        "text": String(StringEscapeUtils.unescapeHtml(article.getCleanedArticleText()))
                    }
                } catch(error) {
                    application.logger.debug(error + ": " + uri)
                    return null
                }
                if (srclang && tlang) {
                    // use Google Translate Java API
                    var title = Public.translate.execute(retval.title, Language.fromString(srclang), Language.fromString(tlang))
                    var text = Public.translate.execute(retval.text, Language.fromString(srclang), Language.fromString(tlang))
                    retval = {
                        "title": String(title),
                        "text": String(text)
                    }
                }
                return retval
            }
        }
    }
    // Initialize
    Public.config = register(Configuration, null, {'setEnableImageFetching': false})
    Public.extractor = register(ContentExtractor, Public.config)
    try {
        Public.translate = register(Translate, null, {'setHttpReferrer': application.globals.get('proose.settings.httpReferrer')})
    } catch(error) {
        // Google Translate library is optional
    }
    return Public
}()

