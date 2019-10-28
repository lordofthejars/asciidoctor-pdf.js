const assetUriScheme = (node) => {
  let result = node.getAttribute('asset-uri-scheme', 'https')
  if (result.trim() !== '') {
    result = `${result}:`
  }
  return result
}

const syntaxHighlighterHead = (node, syntaxHighlighter, attrs) => {
  if (syntaxHighlighter !== Opal.nil && syntaxHighlighter['$docinfo?']('head')) {
    return syntaxHighlighter['$docinfo']('head', node, Opal.hash(attrs))
  }
  return ''
}

const syntaxHighlighterFooter = (node, syntaxHighlighter, attrs) => {
  if (syntaxHighlighter !== Opal.nil && syntaxHighlighter['$docinfo?']('footer')) {
    return syntaxHighlighter['$docinfo']('footer', node, Opal.hash(attrs))
  }
  return ''
}

const getAuthors = function (node) {
  const result = [];
  const authorCount = node.getAttribute('authorcount')
  if (authorCount > 1) {
    for (let index = 1; index < authorCount + 1; index++) {
      const author = node.getAttribute(`author_${index}`)
      const email = node.getAttribute(`email_${index}`)
      const bio = node.getAttribute(`authorbio_${index}`)
      let twitter;
      if (email && email.startsWith("https://twitter.com/")) {
        twitter = email.replace("https://twitter.com/", "");
      }
      result.push({ name: author, email: email, bio: bio, twitter: twitter })
    }
  } else {
    const author = node.getAttribute('author')
    const email = node.getAttribute('email')
    const bio = node.getAttribute(`authorbio`)
    let twitter;
    if (email && email.startsWith("https://twitter.com/")) {
      twitter = email.replace("https://twitter.com/", "");
    }
    result.push({ name: author, email: email, bio: bio, twitter: twitter })
  }
  return result;
}

const renderAuthors = function (authors) {
  return authors.map(author => {
    return `<div class="author">
<div class="author-avatar"><img src="http://avatars.io/twitter/${author.twitter}"/></div>
<div class="author-name"><a href="${author.email}">@${author.twitter}</a></div>
<div class="author-bio">${author.bio}</div>
</div>
`;
  }).join('\n')
}

module.exports = {
    paragraph: (node) => `<p class="${node.getRoles().join(' ')}">${node.getContent()}</p>`,
    document: (node) => {
      const cdnBaseUrl = `${assetUriScheme(node)}//cdnjs.cloudflare.com/ajax/libs`
      const linkcss = node.isAttribute('linkcss')
      const syntaxHighlighter = node['$syntax_highlighter']()
      return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
${syntaxHighlighterHead(node, syntaxHighlighter, { linkcss: linkcss })}
<link href="./redhat/assets/style.css" rel="stylesheet">
</head>
<body>
<header>
  <h1>${node.getHeader().getTitle()}</h1>
  <img class="logo" src="./redhat/assets/${node.getAttribute('logo')}"/>
</header>
<section class="content">
${node.getContent()}
<div class="sect1 authors">
<h3>Authors :</h3>
${renderAuthors(getAuthors(node))}
<div class="author-bio">${node.getAttribute('version')}</div>
<img src="./redhat/assets/by-nc-sa.png"/>
</div>

</section>
${syntaxHighlighterFooter(node, syntaxHighlighter, { cdn_base_url: cdnBaseUrl, linkcss: linkcss, self_closing_tag_slash: '/' })}
</body>`
  },
  page_break: () => `<div class="page-break"></div>`
}
