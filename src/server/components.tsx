import * as React from 'react'

interface LeafProps {
  children: string
}

interface TreeProps {
  children: React.ReactNode
}

type LeafNode = React.FC<LeafProps>

type TreeNode = React.FC<TreeProps>

function leafNode(tag: string): LeafNode {
  return props => React.createElement(tag, props)
}

function treeNode(tag: string): TreeNode {
  return props => React.createElement<TreeProps>(tag, props)
}

export const Title = leafNode('title')
export const Link = leafNode('ink')
export const Guid = leafNode('guid')
export const PubDate = leafNode('pubdate')
export const Description = leafNode('description')

export const Item = treeNode('item')
export const Channel = treeNode('channel')
export const RSS: TreeNode = props =>
  React.createElement('rss', {version: "2.0", ...props})
