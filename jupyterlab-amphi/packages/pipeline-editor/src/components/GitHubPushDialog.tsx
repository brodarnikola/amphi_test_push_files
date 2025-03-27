import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { GitHubService } from '../services/github/GitHubService';

interface GitHubPushDialogProps {
  open: boolean;
  onClose: () => void;
  code: string;
}

const GitHubPushDialog: React.FC<GitHubPushDialogProps> = ({ open, onClose, code }) => {
  const [repoName, setRepoName] = useState('');
  const [commitMessage, setCommitMessage] = useState('');

  const handlePush = async () => {
    const gitHubService = new GitHubService();
    try {
      await gitHubService.pushFileToRepo(repoName, 'OUTPUT.md', code, commitMessage);
      alert('File pushed successfully!');
      onClose();
    } catch (error) {
      console.error('Error pushing file to GitHub:', error);
      alert('Failed to push file to GitHub. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Push to GitHub</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Repository Name"
          type="text"
          fullWidth
          variant="outlined"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Commit Message"
          type="text"
          fullWidth
          variant="outlined"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handlePush} color="primary">
          Push
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GitHubPushDialog;