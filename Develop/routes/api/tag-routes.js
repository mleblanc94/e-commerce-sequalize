const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{
        model: Product,
        as: 'products',
        attributes: ["id", "product_name", "price", "stock", "category_id"],
        through: {
          model: ProductTag,
          attributes: ["id", "product_id", "tag_id"],
          }
        }]
      })
    res.json(tagData);
  } catch (error) {
    res.status(500).json(error);
  }}
)

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product,
        as: 'products',
        attributes: ["id", "product_name", "price", "stock", "category_id"],
        through: {
          model: ProductTag,
          attributes: ["id", "product_id", "tag_id"],
        }
      }]
    })
    res.json(tagData);
  } catch (err) {
    res.status(500).json(err); 
  }
});

router.post('/', (req, res) => {
   /* req.body should look like this...
    {
      "tag_name": "testTag"
    }
  */
 Tag.create(req.body)
 .then((tags) => {
  res.status(200).json(tags)
 })
 .catch((err) => {
  res.status(400).json(err);
 });
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tagData[0]) {
      res.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.findByPk(req.params.id);

    // If there is no match on id's given by user to db, it'll return the message below
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    // Delete the tag now that the associations are gone
    Tag.destroy({
      where: {
        id: req.params.id
      }
    })

    res.status(200).json("Tag was successfully deleted!");
  } catch (err) {
    // res.status(500).json(err);
    console.error(err);
  }
});

module.exports = router;
