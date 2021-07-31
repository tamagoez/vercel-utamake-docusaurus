module.exports = {
  someSidebar: {
    Docusaurus: ['doc1' , 'doc2', 'doc3'],
    Features: ['mdx'],
  },
  wiki: [
    {
      type: "doc",
      items: ["wiki/home"],
    },
    {
      type: "category",
      label: "Important",
      items: ["wiki/important/connect-note-to-site", "wiki/important/premium-user", "wiki/important/wiki-rules"],
    },
  ],
};
