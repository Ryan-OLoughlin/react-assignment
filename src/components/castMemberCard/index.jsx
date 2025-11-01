import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';
import usePerson from '../../hooks/usePerson';
import usePersonCredits from '../../hooks/usePersonCredits';
import { calculateAge } from '../../util.jsx';

/**
 * CastMemberCard
 * Props:
 * - personId (number) required
 * - name (string) optional fallback
 * - profile_path (string) optional fallback
 * - roleLabel (string) optional (e.g., character or department)
 * - age (number|null) optional precomputed age (if provided the hook won't be needed for age)
 * - loading (bool) optional indicates age is being loaded externally
 */
const CastMemberCard = ({ personId, name: propName, profile_path: propProfile, roleLabel, age: propAge, loading }) => {
  const { person, isPending } = usePerson(personId);

  const personName = (person && person.name) || propName || 'Unknown';
  const profile = (person && person.profile_path) || propProfile;
  const birthday = person && person.birthday;
  const computedAge = propAge !== undefined ? propAge : (birthday ? calculateAge(birthday) : null);

  const { credits, isPending: creditsPending } = usePersonCredits(personId);
  const movieCount = Array.isArray(credits) ? credits.length : null;

  const showLoading = loading || (propAge === undefined && isPending && !birthday);

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Link to={`/person/${personId}`}>
        <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
          <Avatar
            src={profile ? `https://image.tmdb.org/t/p/w185${profile}` : undefined}
            alt={personName}
            sx={{ width: 88, height: 88, mb: 1 }}
          />
          <Typography variant="subtitle2" noWrap sx={{ textAlign: 'center' }}>{personName}</Typography>
          {roleLabel && (
            <Typography variant="caption" color="text.secondary" noWrap sx={{ textAlign: 'center' }}>{roleLabel}</Typography>
          )}
          {showLoading ? (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>Age: loading...</Typography>
          ) : (
            computedAge !== null && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>Age: {computedAge}</Typography>
            )
          )}
          {creditsPending ? (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>Movies: loading...</Typography>
          ) : (
            movieCount !== null && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>Movies: {movieCount}</Typography>
            )
          )}
        </Card>
      </Link>
    </Grid>
  );
};

export default CastMemberCard;
