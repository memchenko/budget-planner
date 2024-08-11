import { Chip } from '@nextui-org/chip';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import { observer } from 'mobx-react-lite';
import { useController } from '../../lib/hooks/useController';
import { TagsListController } from './controller';
import styles from './styles.module.css';
import { getTagColor } from './helpers';

export interface TagsListProps {
  type: TagsListController['type'];
}

export const TagsList = observer((props: TagsListProps) => {
  const ctrl = useController(TagsListController);
  ctrl.type = props.type;

  return (
    <div className={styles.tagsList}>
      {ctrl.mostPopularTags.length > 0 && (
        <>
          <span className={styles.label}>Recommended:</span>
          <ul className={styles.chipsList}>
            {ctrl.mostPopularTags.map((tag) => (
              <li key={tag.id}>
                <Chip
                  color={getTagColor(tag.title)}
                  size="lg"
                  variant="flat"
                  className="cursor-pointer"
                  onClick={() => ctrl.handleTagSelect(tag.id)}
                >
                  {tag.title}
                </Chip>
              </li>
            ))}
          </ul>
          <Divider />
        </>
      )}

      <Autocomplete
        label="Select tag"
        popoverProps={{
          updatePositionDeps: [ctrl.selectedTags.length],
        }}
        listboxProps={{
          emptyContent: ctrl.shouldDisplayCreateTagButton ? (
            <Button fullWidth color="primary" onClick={ctrl.handleCreateTagClick}>
              Create tag "{ctrl.searchQuery}"
            </Button>
          ) : (
            'No more tags exist'
          ),
        }}
        selectedKey={null}
        onInputChange={ctrl.handleSearchQueryChange}
        onSelectionChange={(key) => {
          return ctrl.handleTagSelect(String(key));
        }}
        onClick={(e) => {
          e.currentTarget.focus();
        }}
      >
        {ctrl.allTags.map((tag) => (
          <AutocompleteItem key={tag.id} value={tag.id}>
            {tag.title}
          </AutocompleteItem>
        ))}
      </Autocomplete>

      {ctrl.selectedTags.length > 0 && (
        <>
          <Divider />
          <span className={styles.label}>Selected tags:</span>
          <ul className={styles.chipsList}>
            {ctrl.selectedTags.map((tag) => (
              <li key={tag.id}>
                <Chip
                  isCloseable
                  color={getTagColor(tag.title)}
                  size="lg"
                  variant="flat"
                  className="cursor-pointer"
                  onClick={() => ctrl.handleTagUnselect(tag.id)}
                  onClose={() => ctrl.handleTagUnselect(tag.id)}
                >
                  {tag.title}
                </Chip>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
});
