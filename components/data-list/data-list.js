/**
  * @name Data List
  * @category Components
  * @framework React
  * @extends {PureComponent}
  * @description A component for rendering interactive hierarchical tables.
  * @example-file ./data-list.examples.html
  */
/* @flow */

import React, {PureComponent, Element} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import focusSensorHOC from '../global/focus-sensor-hoc';
import selectionShortcutsHOC from '../table/selection-shortcuts-hoc';
import disableHoverHOC from '../table/disable-hover-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import Selection from './selection';
import Group, {moreLessButtonStates} from './group';
import type {ItemType, GroupType} from './types';
import styles from './data-list.css';

import type {MoreLessButtonState} from './group';

type Props = {
  className?: string,
  data: GroupType[],
  loading: boolean,

  groupsAreCollapsible: boolean,
  onGroupCollapse: (item?: GroupType) => void,
  onGroupExpand: (item?: GroupType) => void,
  isGroupCollapsed: (item?: GroupType) => boolean,

  onItemCollapse: (item?: ItemType) => void,
  onItemExpand: (item?: ItemType) => void,
  isItemCollapsed: (item?: ItemType) => boolean,

  onGroupMoreLess: (group?: GroupType, more?: boolean) => void,
  groupMoreLessState: (group?: GroupType) => MoreLessButtonState,

  remoteSelection: boolean,

  // selectionShortcutsHOC
  selection: Selection,
  selectable: boolean,
  onSelect: (selection?: Selection) => void,
  shortcutsMap: {},

  // focusSensorHOC
  focused: boolean,

  // disableHoverHOC
  disabledHover: boolean
};

class DataList extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,

    groupsAreCollapsible: PropTypes.bool,
    onGroupCollapse: PropTypes.func,
    onGroupExpand: PropTypes.func,
    isGroupCollapsed: PropTypes.func,

    onItemCollapse: PropTypes.func,
    onItemExpand: PropTypes.func,
    isItemCollapsed: PropTypes.func,

    onGroupMoreLess: PropTypes.func,
    groupMoreLessState: PropTypes.func,

    remoteSelection: PropTypes.bool
  };

  static defaultProps = {
    loading: false,
    groupItemsLimit: Infinity,

    groupsAreCollapsible: false,
    onGroupCollapse: () => {},
    onGroupExpand: () => {},
    isGroupCollapsed: () => true,

    onItemCollapse: () => {},
    onItemExpand: () => {},
    isItemCollapsed: () => true,

    onGroupMoreLess: () => {},
    groupMoreLessState: () => moreLessButtonStates.UNUSED,

    remoteSelection: false
  };

  state = {
    shortcutsEnabled: this.props.focused,
    shortcutsScope: getUID('ring-data-list-')
  };

  componentWillReceiveProps(nextProps) {
    const {data, selection, onSelect, selectable} = this.props;

    if (data !== nextProps.data && !this.props.remoteSelection) {
      onSelect(selection.cloneWith({data: nextProps.data}));
    }

    if (!nextProps.selectable && nextProps.selectable !== selectable) {
      onSelect(selection.resetSelection());
    }

    const shortcutsEnabled = nextProps.focused;
    if (shortcutsEnabled !== this.state.shortcutsEnabled) {
      this.setState({shortcutsEnabled});
    }
  }

  props: Props;

  onGroupOrItemFocus = (groupOrItem: GroupType|ItemType): void => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(groupOrItem));
  };

  onGroupOrItemSelect = (groupOrItem: GroupType|ItemType, selected: boolean): void => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(groupOrItem));
    } else {
      onSelect(selection.deselect(groupOrItem));
    }
  };

  render(): Element<any> {
    const {
      data, className, loading,
      onItemCollapse, onItemExpand, isItemCollapsed,
      onGroupCollapse, onGroupExpand, isGroupCollapsed,
      selection, disabledHover, groupsAreCollapsible
    } = this.props;

    const classes = classNames(className, {
      [styles.dataList]: true,
      [styles.disabledHover]: disabledHover,
      [styles.multiSelection]: selection.getSelected().size > 0
    });

    return (
      <div className={styles.dataListWrapper}>
        {this.state.shortcutsEnabled &&
          <Shortcuts
            map={this.props.shortcutsMap}
            scope={this.state.shortcutsScope}
          />
        }

        <ul className={classes}>
          {data.map(group => {
            const {id, title, items} = group;

            const showMoreLessButton = this.props.groupMoreLessState(group);

            return (
              <Group
                key={id}
                group={group}
                title={title}
                items={items}
                onItemExpand={onItemExpand}
                onItemCollapse={onItemCollapse}
                isItemCollapsed={isItemCollapsed}
                showMoreLessButton={showMoreLessButton}
                onGroupMoreLess={this.props.onGroupMoreLess}
                onFocus={this.onGroupOrItemFocus}
                focused={selection.isFocused(group)}
                showFocus={selection.isFocused(group)}
                onSelect={this.onGroupOrItemSelect}
                selection={selection}
                selectable={group.selectable}
                selected={selection.isSelected(group)}
                collapsible={groupsAreCollapsible}
                collapsed={isGroupCollapsed(group)}
                onExpand={onGroupExpand}
                onCollapse={onGroupCollapse}
              />
            );
          })}
        </ul>

        {loading && (
          <div className={styles.loadingOverlay}>
            <Loader/>
          </div>
        )}
      </div>
    );
  }
}

export default disableHoverHOC(selectionShortcutsHOC(focusSensorHOC(DataList)));
