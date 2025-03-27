import React, { useCallback, useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { CodeEditor } from './components/CodeEditor';
import { GitHubPushDialog } from './components/GitHubPushDialog';
import { GitHubService } from './services/github/GitHubService';
import { AuthService } from './services/github/AuthService';
import { IProps } from './types';

const PIPELINE_CLASS = 'amphi-PipelineEditor';

export class PipelineEditorWidget extends React.Component<IProps> {
  private githubService: GitHubService;
  private authService: AuthService;

  constructor(props: IProps) {
    super(props);
    this.githubService = new GitHubService();
    this.authService = new AuthService();
  }

  handlePushToGitHub = async (code: string) => {
    const repoName = prompt('Enter the repository name:');
    const commitMessage = prompt('Enter the commit message:');
    
    if (repoName && commitMessage) {
      try {
        await this.githubService.pushFileToRepo(repoName, 'OUTPUT.md', code, commitMessage);
        alert('File pushed to GitHub successfully!');
      } catch (error) {
        console.error('Error pushing file to GitHub:', error);
        alert('Failed to push file to GitHub.');
      }
    }
  };

  render() {
    return (
      <div className={PIPELINE_CLASS}>
        <ReactFlowProvider>
          <CodeEditor onSave={this.handlePushToGitHub} />
          <GitHubPushDialog />
        </ReactFlowProvider>
      </div>
    );
  }
}